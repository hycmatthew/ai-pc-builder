import {
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedRAMType,
} from '../constant/mappedObjectTypes'
import {
  BOTTLENECK_TOLERANCE,
  BUILD_WEIGHTS,
  BuildType,
  RAM_BRAND_FACTOR,
  RAM_OPTIMAL_CAPACITY,
  RAM_SPEED_WEIGHTS,
} from '../constant/buildType'
import { calculateBudgetFactor, calculateChipsetMultiplier } from './scoreLogic'
import { getMapValue } from '../../../utils/StringUtil'
import BuildConfig from '../constant/buildConfig'

type BestConfiguration = {
  cpu: MappedCPUType
  motherboard: MappedMotherboardType
  ram: MappedRAMType
  gpu: MappedGPUType | null
  totalPrice: number
  performanceScore: number
}

// 改进性能评分计算
function calculatePerformanceScore(
  cpuScore: number,
  gpuScore: number,
  ramScore: number,
  mbScore: number,
  buildType: BuildType,
  budgetFactor: number
): number {
  const benchmarkScores = BuildConfig.Benchmark_Scores
  const weights = BUILD_WEIGHTS[buildType]
  const mbWeight = 0.02 * budgetFactor

  // 1. 分数标准化（考虑价格性能比）
  const normalizedCpu =
    (cpuScore / benchmarkScores.MidRangeCpu) * benchmarkScores.MidRangeGpu
  const normalizedGpu = gpuScore // GPU保持原样

  // 2. 价格感知的瓶颈检测
  const cpuThreshold =
    benchmarkScores.MidRangeCpu * BOTTLENECK_TOLERANCE[buildType].cpu
  const gpuThreshold =
    benchmarkScores.MidRangeGpu * BOTTLENECK_TOLERANCE[buildType].gpu

  let bottleneckPenalty = 1

  // CPU瓶颈检测（当CPU低于阈值时惩罚）
  if (cpuScore < cpuThreshold) {
    const deficit = (cpuThreshold - cpuScore) / cpuThreshold
    bottleneckPenalty *= 1 - Math.pow(deficit, 1.5)
  }

  // GPU瓶颈检测（当GPU低于阈值时惩罚）
  if (gpuScore < gpuThreshold) {
    const deficit = (gpuThreshold - gpuScore) / gpuThreshold
    bottleneckPenalty *= 1 - Math.pow(deficit, 1.5)
  }

  // 3. 加权计算（使用标准化分数）
  const weightedCpu = normalizedCpu * weights.cpu
  const weightedGpu = normalizedGpu * weights.gpu
  const totalCpuGpu = weightedCpu + weightedGpu

  // 4. 应用瓶颈惩罚
  const bottleneckAdjusted = totalCpuGpu * bottleneckPenalty

  // 5. 主板分数计算
  const mbComponent = mbScore * totalCpuGpu * mbWeight

  return Math.max(0, bottleneckAdjusted + ramScore + mbComponent)
}

export const findBestConfiguration = (
  cpus: MappedCPUType[],
  gpus: MappedGPUType[],
  motherboards: MappedMotherboardType[],
  rams: MappedRAMType[],
  budget: number,
  buildType: BuildType
) => {
  const bestCandidates: BestConfiguration[] = []
  // 预处理数据结构
  const ramsByType = groupRamsByType(rams)
  const [sortedGPUs, gpuLookupTable] = preprocessGPUs(gpus)

  const budgetFactor = calculateBudgetFactor(budget, 1.5, 3)
  console.log('getMappedMotherboards:', motherboards)

  // 按性能/价格比排序CPU
  const sortedCPUs = [...cpus].sort(
    (a, b) => b.score / b.price - a.score / a.price
  )

  // 遍历所有可能的CPU
  for (const cpu of sortedCPUs) {
    // 获取兼容主板
    const compatibleMBs = motherboards.filter((mb) => mb.socket === cpu.socket)
    for (const mb of compatibleMBs) {
      // 提前终止条件
      if (cpu.price + mb.price > budget * 0.7) continue

      // 获取兼容内存
      const compatibleRams = (ramsByType.get(mb.ramType) || [])
        .filter((ram) => ram.channel <= mb.ramSlot)
        .map((ram) => {
          // 计算性能分时同时获取原始性能分和价格
          const rawScore = calculateRamPerformance(
            buildType,
            budget,
            ram,
            mb.ramSupport
          )

          // 新增：计算性价比 (性能分/价格)
          const valueRatio = ram.price > 0 ? rawScore / ram.price : 0 // 防御除零错误

          return {
            ...ram,
            rawScore, // 保留原始性能分
            valueRatio, // 新增性价比指标
          }
        })
        // 改为按性价比降序排序
        .sort((a, b) => b.valueRatio - a.valueRatio)
        .slice(0, 10) // 取性价比前10

      for (const ram of compatibleRams) {
        const baseCost = cpu.price + mb.price + ram.price
        if (baseCost > budget) continue

        // 计算CPU实际性能
        const effectiveCPUScore =
          cpu.score * calculateChipsetMultiplier(cpu, mb)
        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          const totalPrice = baseCost
          const performanceScore = calculatePerformanceScore(
            effectiveCPUScore,
            cpu.integratedGraphicsScore,
            ram.rawScore,
            mb.score,
            buildType,
            budgetFactor
          )
          addToCandidates(bestCandidates, {
            cpu,
            motherboard: mb,
            ram,
            gpu: null,
            totalPrice,
            performanceScore,
          })
        }

        // 情况2: 使用独立显卡
        const remainingBudget = budget - baseCost
        if (remainingBudget >= 0) {
          const bestGPU = findBestGPU(
            sortedGPUs,
            gpuLookupTable,
            remainingBudget
          )
          if (bestGPU) {
            const totalPrice = baseCost + bestGPU.price
            const performanceScore = calculatePerformanceScore(
              effectiveCPUScore,
              bestGPU.score,
              ram.rawScore,
              mb.score,
              buildType,
              budgetFactor
            )
            addToCandidates(bestCandidates, {
              cpu,
              motherboard: mb,
              ram,
              gpu: bestGPU,
              totalPrice,
              performanceScore,
            })
          }
        }
      }
    }
  }
  return selectBestCandidate(bestCandidates, budget)
}

// 优化7: 改进GPU查找算法
function findBestGPU(
  sortedGPUs: MappedGPUType[],
  lookupTable: number[],
  budget: number
): MappedGPUType | undefined {
  let low = 0
  let high = sortedGPUs.length - 1
  let bestIndex = -1

  // 二分查找最大可承受价格
  while (low <= high) {
    const mid = (low + high) >> 1 // 更快的位运算
    if (sortedGPUs[mid].price <= budget) {
      bestIndex = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  if (bestIndex === -1) return undefined

  // 查找具有目标分数的第一个GPU
  const targetScore = lookupTable[bestIndex]

  // 反向线性扫描（针对小范围优化）
  const startIndex = Math.max(0, bestIndex - 10)
  for (let i = bestIndex; i >= startIndex; i--) {
    if (sortedGPUs[i].score === targetScore) {
      return sortedGPUs[i]
    }
  }

  return sortedGPUs[bestIndex] // 安全回退
}

/************************* Helper Function *************************/
// 添加配置到候选列表
function addToCandidates(
  bestCandidates: BestConfiguration[],
  config: BestConfiguration
) {
  const maxCandidateNum = BuildConfig.LogicCandidatesNum
  // 如果候选列表未满或新配置优于最差候选
  if (
    bestCandidates.length < maxCandidateNum ||
    config.performanceScore >
      bestCandidates[bestCandidates.length - 1].performanceScore
  ) {
    // 插入新配置并保持排序（按性能降序）
    let inserted = false
    for (let i = 0; i < bestCandidates.length; i++) {
      if (config.performanceScore > bestCandidates[i].performanceScore) {
        bestCandidates.splice(i, 0, config)
        inserted = true
        break
      }
    }

    // 如果未插入则添加到末尾
    if (!inserted && bestCandidates.length < maxCandidateNum) {
      bestCandidates.push(config)
    }

    // 保持最多10个候选
    if (bestCandidates.length > maxCandidateNum) {
      bestCandidates.pop()
    }
  }
}

function selectBestCandidate(
  candidates: BestConfiguration[],
  budget: number
): BestConfiguration | null {
  if (candidates.length === 0) return null

  // 1. 计算所有配置的最高性价比作为基准
  let maxValueRatio = 0
  candidates.forEach((c) => {
    const valueRatio = c.performanceScore / c.totalPrice
    if (valueRatio > maxValueRatio) maxValueRatio = valueRatio
  })

  // 2. 筛选满足预算要求的配置（85%以上）
  const highBudgetCandidates = candidates.filter(
    (c) => c.totalPrice >= budget * 0.85
  )

  // 3. 优先考虑满足预算要求的配置
  if (highBudgetCandidates.length > 0) {
    return findBestValueConfig(highBudgetCandidates, maxValueRatio, budget)
  }

  // 4. 如果没有满足预算要求的，考虑所有配置
  return findBestValueConfig(candidates, maxValueRatio, budget)
}

// 改进的价值评估函数：考虑性能增量的性价比
function findBestValueConfig(
  candidates: BestConfiguration[],
  maxValueRatio: number,
  budget: number
): BestConfiguration {
  // 按价格升序排序
  candidates.sort((a, b) => a.totalPrice - b.totalPrice)
  console.log(candidates)
  console.log('maxValueRatio: ', maxValueRatio)

  let bestConfig = candidates[0]
  // let bestValue = bestConfig.performanceScore / bestConfig.totalPrice

  // 从最便宜的配置开始，逐步比较更贵的配置
  for (let i = 1; i < candidates.length; i++) {
    const current = candidates[i]
    const previous = bestConfig

    // 计算额外花费带来的性能提升
    const priceDiff = current.totalPrice - previous.totalPrice
    const scoreDiff = current.performanceScore - previous.performanceScore

    // 只有当性能确实提升时才考虑
    if (scoreDiff > 0 && priceDiff > 0) {
      // 计算增量性价比（每元带来的性能提升）
      const incrementalValue = scoreDiff / priceDiff

      // 计算增量性价比与最高性价比的比例
      const incrementalRatio = incrementalValue / maxValueRatio

      // 如果增量性价比达到最高性价比的80%，则选择更好的配置
      const budgetFactor = calculateBudgetFactor(budget, 0.8, 0.4)
      if (incrementalRatio >= budgetFactor) {
        console.log(
          'bestConfig: ',
          bestConfig,
          ' - incrementalRatio:',
          incrementalRatio
        )
        console.log('new bestConfig: ', current)
        bestConfig = current
        // bestValue = current.performanceScore / current.totalPrice
      }
    }
  }

  return bestConfig
}

// GPU预处理（排序+创建查找表）
function preprocessGPUs(gpus: MappedGPUType[]): [MappedGPUType[], number[]] {
  // 按价格排序并创建最大值数组
  const sorted = [...gpus].sort((a, b) => a.price - b.price)
  const lookupTable: number[] = []
  let maxScore = 0

  sorted.forEach((gpu, index) => {
    maxScore = Math.max(maxScore, gpu.score)
    lookupTable[index] = maxScore
  })

  return [sorted, lookupTable]
}

/****************************** Ram Logic ******************************/
function groupRamsByType(rams: MappedRAMType[]) {
  const map = new Map<string, MappedRAMType[]>()
  rams.forEach((ram) => {
    const key = ram.type
    map.set(key, [...(map.get(key) || []), ram])
  })
  return map
}

// RAM评分函数
function calculateRamPerformance(
  usage: BuildType,
  budget: number,
  ram: MappedRAMType,
  supportedSpeeds: number[]
): number {
  const budgetFactor = calculateBudgetFactor(budget, 1, 3)
  // 1. 计算有效速度（不超过主板支持）
  const maxSupported = Math.max(...supportedSpeeds)
  const effectiveSpeed = Math.min(ram.speed, maxSupported)

  // 2. 获取当前用途的最佳容量和速度阈值
  const optimalCapacity = RAM_OPTIMAL_CAPACITY[usage]
  const speedThreshold = 6000
  const latencyThreshold = 30

  // 3. 计算容量分数（平滑函数）
  const capacityScore = calculateCapacityScore(
    usage,
    ram.capacity,
    optimalCapacity
  )

  // 4. 计算速度分数
  const speedScore = calculateSpeedScore(
    effectiveSpeed,
    speedThreshold,
    RAM_SPEED_WEIGHTS[usage]
  )

  // 5. 计算延迟惩罚（线性计算）
  const latencyPenalty = (ram.latency - latencyThreshold) * 80

  // 6. 通道数加成
  const channelMultiplier = ram.channel > 1 ? 1.2 : 1.0

  // 7. 基础分计算
  const baseScore = (speedScore - latencyPenalty) * capacityScore

  // 8. 应用通道数加成
  const channelBoostedScore = baseScore * channelMultiplier

  // 9. 技术加成
  let techFactor = 1.0
  if (ram.type.toUpperCase().includes('DDR5')) techFactor *= 1.3
  if (ram.hasHeatsink) techFactor *= 1.05

  // 10. 品牌加成
  const brand = ram.brand.toUpperCase().trim()
  const brandFactor = getMapValue(RAM_BRAND_FACTOR, brand)

  // 12. 最终分数
  let finalScore = channelBoostedScore * techFactor * brandFactor * budgetFactor
  return finalScore
}

// 平滑容量分数计算
function calculateCapacityScore(
  usage: BuildType,
  capacity: number,
  optimalCapacity: number
): number {
  // 低于最佳容量：线性增长
  if (capacity < optimalCapacity) {
    return capacity / optimalCapacity
  }

  // 超过最佳容量：收益急剧下降
  const baseScore = 2
  const excessRatio = (capacity - optimalCapacity) / optimalCapacity

  // 根据不同用途应用不同的下降曲线
  switch (usage) {
    case 'gaming':
      // 游戏用途超过最佳容量几乎无收益
      return baseScore + Math.log1p(excessRatio) * 0.1
    case 'balance':
      // 平衡用途适度收益
      return baseScore + Math.log1p(excessRatio) * 0.3
    case 'rendering':
    case 'ai':
      // 渲染/AI用途有较好收益
      return baseScore + Math.sqrt(excessRatio) * 0.7
    default:
      return baseScore + Math.log1p(excessRatio) * 0.2
  }
}

// 速度分数计算
function calculateSpeedScore(
  speed: number,
  threshold: number,
  weight: number
): number {
  // 低于阈值：线性增长
  if (speed <= threshold) {
    return speed
  }

  // 高于阈值：对数增长（收益递减）
  const excessSpeed = (speed - threshold) * weight
  return threshold + excessSpeed
}
