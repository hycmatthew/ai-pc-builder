import {
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedRAMType,
} from '../constant/mappedObjectTypes'
import {
  BUILD_WEIGHTS,
  BuildType,
  RAM_BRAND_FACTOR,
  RAM_OPTIMAL_CAPACITY,
  RAM_SPEED_WEIGHTS,
} from '../constant/buildType'
import { calculateBudgetFactor, calculateChipsetMultiplier } from './scoreLogic'
import { getMapValue } from '../../../utils/StringUtil'

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
  const weights = BUILD_WEIGHTS[buildType]
  // Update weight by budgetFactor
  const mbWeight = 0.02 * budgetFactor
  const ramWeight = weights.ram * budgetFactor

  // 處理瓶頸效應：計算CPU/GPU平衡因子（0.5~1.0）
  const updateCpuScore = cpuScore / weights.cpu
  const updateGpuScore = gpuScore / weights.gpu
  const minPerf = Math.min(updateCpuScore, updateGpuScore)
  const maxPerf = Math.max(updateCpuScore, updateGpuScore)

  // 瓶頸調整係數：性能差距越大，懲罰越強
  const bottleneckFactor = minPerf / maxPerf // [0,1]

  // 平衡補償係數：當性能匹配時給予獎勵
  const balanceBonus = 0.5 * (0.6 + bottleneckFactor)

  // 計算瓶頸調整後的CPU/GPU組合分數
  const adjustedCpuGpu =
    (cpuScore * weights.cpu + gpuScore * weights.gpu) * (0.6 + balanceBonus)

  const mbComponent = mbScore * adjustedCpuGpu * mbWeight
  const ramComponent = ramScore * ramWeight

  // 組合總分（確保非負）
  return Math.max(0, adjustedCpuGpu + ramComponent + mbComponent)
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
        .map((ram) => ({
          ...ram,
          score: calculateRamPerformance(buildType, ram, mb.ramSupport),
        }))

      for (const ram of compatibleRams) {
        const baseCost = cpu.price + mb.price + ram.price
        if (baseCost > budget) continue

        // 计算CPU实际性能
        const effectiveCPUScore =
          cpu.score * calculateChipsetMultiplier(cpu, mb)
        console.log(cpu.id, ' - cpu score: ', cpu.score)
        console.log(mb.id, ' - effectiveCPUScore: ', effectiveCPUScore)

        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          const totalPrice = baseCost
          const performanceScore = calculatePerformanceScore(
            effectiveCPUScore,
            cpu.integratedGraphicsScore,
            ram.score,
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
              ram.score,
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
// 添加配置到候选列表（最多保留10个最佳）
function addToCandidates(
  bestCandidates: BestConfiguration[],
  config: BestConfiguration
) {
  // 如果候选列表未满或新配置优于最差候选
  if (
    bestCandidates.length < 10 ||
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
    if (!inserted && bestCandidates.length < 10) {
      bestCandidates.push(config)
    }

    // 保持最多10个候选
    if (bestCandidates.length > 10) {
      bestCandidates.pop()
    }
  }
}

function selectBestCandidate(
  candidates: BestConfiguration[],
  budget: number
): BestConfiguration | null {
  if (candidates.length === 0) return null

  // 1. 按性能分数降序排序
  candidates.sort((a, b) => b.performanceScore - a.performanceScore)

  // 2. 计算所有配置的最高性价比作为基准
  let maxValueRatio = 0
  candidates.forEach((c) => {
    const valueRatio = c.performanceScore / c.totalPrice
    if (valueRatio > maxValueRatio) maxValueRatio = valueRatio
  })

  // 3. 筛选满足预算要求的配置（85%以上）
  const highBudgetCandidates = candidates.filter(
    (c) => c.totalPrice >= budget * 0.85
  )

  // 4. 优先考虑满足预算要求的配置
  if (highBudgetCandidates.length > 0) {
    return findBestValueConfig(highBudgetCandidates, maxValueRatio, budget)
  }

  // 5. 如果没有满足预算要求的，考虑所有配置
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
    const previous = candidates[i - 1]

    // 计算额外花费带来的性能提升
    const priceDiff = current.totalPrice - previous.totalPrice
    const scoreDiff = current.performanceScore - previous.performanceScore

    // 只有当性能确实提升时才考虑
    if (scoreDiff > 0 && priceDiff > 0) {
      // 计算增量性价比（每元带来的性能提升）
      const incrementalValue = scoreDiff / priceDiff

      // 计算增量性价比与最高性价比的比例
      const incrementalRatio = incrementalValue / maxValueRatio

      // 如果增量性价比达到最高性价比的75%，则选择更好的配置
      const budgetFactor = calculateBudgetFactor(budget, 0.75, 0.3)
      if (incrementalRatio >= budgetFactor) {
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
  ram: MappedRAMType,
  supportedSpeeds: number[]
): number {
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
  let finalScore = channelBoostedScore * techFactor * brandFactor
  return Math.max(0, finalScore)
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
      return baseScore + Math.log1p(excessRatio) * 0.2
    case 'balance':
      // 平衡用途适度收益
      return baseScore + Math.log1p(excessRatio) * 0.4
    case 'rendering':
    case 'ai':
      // 渲染/AI用途有较好收益
      return baseScore + Math.sqrt(excessRatio) * 0.8
    default:
      return baseScore + Math.log1p(excessRatio) * 0.3
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
