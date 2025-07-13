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
import { calculateBudgetFactor, calculateEffectiveCPUScore } from './scoreLogic'
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
  mbBudgetFactor: number
): number {
  const { MidRangeCpu, HighEndCpu, MidRangeGpu, HighEndGpu } =
    BuildConfig.Benchmark_Scores

  const weights = BUILD_WEIGHTS[buildType]
  const mbWeight = mbBudgetFactor

  // 1. 保持原逻辑的标准化（用于最终分数计算）
  const normalizedCpu = cpuScore
  const normalizedGpu = gpuScore

  // 2. 计算相对性能位置（0-1范围）
  const cpuRelative = Math.max(
    0,
    (cpuScore - MidRangeCpu) / (HighEndCpu - MidRangeCpu)
  )
  const gpuRelative = Math.max(
    0,
    (gpuScore - MidRangeGpu) / (HighEndGpu - MidRangeGpu)
  )

  // 3. 获取当前构建类型的瓶颈配置
  const {
    idealGpuCpuRatio, // 理想GPU/CPU相对性能差值
    imbalanceSensitivity,
  } = BOTTLENECK_TOLERANCE[buildType]

  // 4. 计算性能偏差
  const actualRatio = gpuRelative - cpuRelative
  const deviation = Math.abs(actualRatio - idealGpuCpuRatio)

  // 5. 计算指数惩罚（使用二次方曲线）
  // 当deviation=0时惩罚为0，deviation=1时惩罚接近最大值
  const penaltyFactor = Math.min(
    0.05,
    imbalanceSensitivity * Math.pow(deviation, 2)
  )

  // 6. 计算基础性能分数（保持原逻辑）
  let baseScore = normalizedCpu * weights.cpu + normalizedGpu * weights.gpu

  // 7. 应用瓶颈惩罚
  baseScore *= 1 - penaltyFactor

  // 8. 主板分数计算（保持原逻辑）
  const mbComponent = 0

  return Math.max(0, baseScore + ramScore + mbComponent)
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

  const mbBudgetFactor = calculateBudgetFactor(budget, 0.01, 0.025)
  console.log('getMappedMotherboards:', motherboards)

  // 按性能/价格比排序CPU
  const sortedCPUs = [...cpus].sort(
    (a, b) => b.score / b.price - a.score / a.price
  )
  // console.log('sortedCPUs:', sortedCPUs)
  // console.log('sortedGPUs:', sortedGPUs)

  // 遍历所有可能的CPU
  for (const cpu of sortedCPUs) {
    // 获取兼容主板
    const compatibleMBs = motherboards.filter((mb) => mb.socket === cpu.socket)
    console.log('compatibleMBs:', compatibleMBs)
    for (const mb of compatibleMBs) {
      // 提前终止条件
      if (cpu.price + mb.price > budget * 0.7) continue
      // mbFactor计算CPU实际性能
      const effectiveCPUScore = calculateEffectiveCPUScore(cpu, mb)
      // 获取兼容内存
      const compatibleRams = (ramsByType.get(mb.ramType) || [])
        .filter((ram) => ram.channel <= mb.ramSlot)
        .map((ram) => {
          // 计算性能分时同时获取原始性能分和价格
          const updatedScore = calculateRamPerformance(
            buildType,
            budget,
            ram,
            mb.ramSupport,
            cpu.brand
          )

          // 新增：计算性价比 (性能分/价格)
          const valueRatio = ram.price > 0 ? updatedScore / ram.price : 0 // 防御除零错误

          return {
            ...ram,
            updatedScore: updatedScore, // 保留原始性能分
            valueRatio, // 新增性价比指标
          }
        })
        // 改为按性价比降序排序
        .sort((a, b) => b.valueRatio - a.valueRatio)
        .slice(0, 10) // 取性价比前10

      for (const ram of compatibleRams) {
        const baseCost = cpu.price + mb.price + ram.price
        if (baseCost > budget) continue

        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          const totalPrice = baseCost
          const performanceScore = calculatePerformanceScore(
            effectiveCPUScore,
            cpu.integratedGraphicsScore,
            ram.updatedScore,
            mb.score,
            buildType,
            mbBudgetFactor
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
              ram.updatedScore,
              mb.score,
              buildType,
              mbBudgetFactor
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
  console.log('candidates:', candidates)
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
      const budgetFactor = calculateBudgetFactor(budget, 0.8, 0.3)
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
  supportedSpeeds: number[],
  cpuBrand: string
): number {
  const budgetFactor = calculateBudgetFactor(budget, 0.7, 1.5)
  const isAmd = cpuBrand.toLowerCase().includes('amd')
  // 1. 计算有效速度（不超过主板支持）
  const maxSupported = Math.max(...supportedSpeeds)
  const cpuMaxSpeed = isAmd ? 6000 : ram.speed
  const effectiveSpeed = Math.min(cpuMaxSpeed, maxSupported)

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
  if (ram.type.toUpperCase().includes('DDR5')) techFactor *= 1.25
  if (ram.hasHeatsink) techFactor *= 1.05
  if ((isAmd && ram.profile_expo) || ram.profile_xmp) techFactor *= 1.05

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
    case 'ai':
    case 'balance':
      // 平衡/AI用途适度收益
      return baseScore + Math.log1p(excessRatio) * 0.3
    case 'rendering':
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
