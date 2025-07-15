import {
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedRAMType,
} from '../constant/mappedObjectTypes'
import { calculateBudgetFactor, calculateEffectiveCPUScore } from './scoreLogic'
import { getMapValue } from '../../../utils/StringUtil'
import BuildConfig from '../constant/buildConfig'
import { UsageConfig } from '../constant/usageConfig'
import { RAM_BRAND_FACTOR } from '../constant/buildFactor'

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
  usageConfig: UsageConfig,
  mbBudgetFactor: number
): number {
  const { MidRangeCpu, HighEndCpu, MidRangeGpu, HighEndGpu } =
    BuildConfig.Benchmark_Scores

  const weights = usageConfig.weights
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
  } = usageConfig.bottleneckTolerance

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
  const mbComponent = mbScore * baseScore * mbWeight

  return Math.max(0, baseScore + ramScore + mbComponent)
}

export const findBestConfiguration = (
  cpus: MappedCPUType[],
  gpus: MappedGPUType[],
  motherboards: MappedMotherboardType[],
  rams: MappedRAMType[],
  budget: number,
  usageConfig: UsageConfig
) => {
  const bestCandidates: BestConfiguration[] = []
  // 预处理数据结构
  const ramsByType = groupRamsByType(rams)
  const [sortedGPUs, gpuLookupTable] = preprocessGPUs(gpus)

  const mbBudgetFactor = calculateBudgetFactor(budget, 0.01, 0.025)

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
    // console.log('compatibleMBs:', compatibleMBs)
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
            usageConfig,
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
        // ========== 核心修改：在addToCandidates中筛选 ==========
        const addCandidate = (gpu: MappedGPUType | null) => {
          const gpuPrice = gpu ? gpu.price : 0
          const gpuScore = gpu ? gpu.score : cpu.integratedGraphicsScore
          const totalPrice = baseCost + gpuPrice

          // 跳过超预算配置
          if (totalPrice > budget) return

          const performanceScore = calculatePerformanceScore(
            effectiveCPUScore,
            gpuScore,
            ram.updatedScore,
            mb.score,
            usageConfig,
            mbBudgetFactor
          )

          // 创建候选配置
          const candidate: BestConfiguration = {
            cpu,
            motherboard: mb,
            ram,
            gpu,
            totalPrice,
            performanceScore,
          }

          // 在添加前进行性价比筛选
          addToCandidates(bestCandidates, candidate, budget)
        }

        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          addCandidate(null)
        }

        // 情况2: 使用独立显卡
        const bestGPU = findBestGPU(
          sortedGPUs,
          gpuLookupTable,
          budget - baseCost
        )
        if (bestGPU) {
          addCandidate(bestGPU)
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
  candidate: BestConfiguration,
  budget: number
) {
  const maxCandidateNum = BuildConfig.LogicCandidatesNum
  // 计算性能增量性价比阈值
  const minIncrementalRatio = calculateBudgetFactor(budget, 0.8, 0.2)

  // 检查候选列表是否为空
  if (bestCandidates.length === 0) {
    bestCandidates.push(candidate)
    return
  }

  // 查找最接近的价格点进行比较
  let closestCandidate: BestConfiguration | null = null
  let minPriceDiff = Infinity

  for (const c of bestCandidates) {
    const priceDiff = Math.abs(c.totalPrice - candidate.totalPrice)
    if (priceDiff < minPriceDiff) {
      minPriceDiff = priceDiff
      closestCandidate = c
    }
  }

  // 计算性能增量性价比
  if (closestCandidate) {
    const priceDiff = candidate.totalPrice - closestCandidate.totalPrice
    const scoreDiff =
      candidate.performanceScore - closestCandidate.performanceScore

    // 只有当价格和性能都有提升时才计算
    if (priceDiff > 0 && scoreDiff > 0) {
      const incrementalValue = scoreDiff / priceDiff
      const baseValue =
        closestCandidate.performanceScore / closestCandidate.totalPrice
      const incrementalRatio = baseValue > 0 ? incrementalValue / baseValue : 0

      // 增量性价比不达阈值则跳过
      if (incrementalRatio < minIncrementalRatio) {
        return
      }
    }
  }

  // 添加配置到候选列表（保持性能降序）
  let inserted = false
  for (let i = 0; i < bestCandidates.length; i++) {
    if (candidate.performanceScore > bestCandidates[i].performanceScore) {
      bestCandidates.splice(i, 0, candidate)
      inserted = true
      break
    }
  }

  // 添加到末尾（如果未插入且列表未满）
  if (!inserted && bestCandidates.length < maxCandidateNum) {
    bestCandidates.push(candidate)
  }

  // 保持最大候选数量
  if (bestCandidates.length > maxCandidateNum) {
    bestCandidates.pop()
  }
}

// ========== 简化后的最终选择函数 ==========
function selectBestCandidate(
  candidates: BestConfiguration[],
  budget: number
): BestConfiguration | null {
  if (candidates.length === 0) return null
  console.log(budget)
  console.log(candidates)
  // 1. 计算预算使用率要求（动态调整）
  const minBudgetUsage = calculateBudgetFactor(budget, 0.5, 0.85)

  // 2. 筛选满足预算使用率的候选配置
  const budgetSatisfied = candidates.filter(
    (c) => c.totalPrice >= budget * minBudgetUsage
  )

  // 3. 优先考虑满足预算使用率的配置
  const evaluationPool =
    budgetSatisfied.length > 0 ? budgetSatisfied : candidates

  // 4. 按价格升序排序，便于增量比较
  evaluationPool.sort((a, b) => a.totalPrice - b.totalPrice)

  // 5. 动态计算增量性价比阈值
  const baseThreshold = calculateBudgetFactor(budget, 0.8, 0.2)
  let bestConfig = evaluationPool[0]

  // 6. 从低价到高价逐步比较增量性价比
  for (let i = 1; i < evaluationPool.length; i++) {
    const current = evaluationPool[i]
    const priceDiff = current.totalPrice - bestConfig.totalPrice

    // 7. 计算增量性价比
    if (priceDiff > 0) {
      const scoreDiff = current.performanceScore - bestConfig.performanceScore

      // 只有性能提升时才考虑
      if (scoreDiff > 0) {
        // 计算增量性价比比率
        const baseValueRatio =
          bestConfig.performanceScore / bestConfig.totalPrice
        const incrementalRatio = scoreDiff / priceDiff / baseValueRatio

        // 8. 根据预算调整增量要求
        const adjustedThreshold =
          budgetSatisfied.length > 0
            ? baseThreshold // 满足预算使用率时使用基础阈值
            : baseThreshold * 1.2 // 不满足时提高20%要求

        // 9. 如果增量性价比达标，则更新最佳配置
        if (incrementalRatio >= adjustedThreshold) {
          bestConfig = current
        }
      }
    }
  }
  console.log('Best Configuration:', bestConfig)
  // 10. 返回最终最佳配置
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
  usageConfig: UsageConfig,
  budget: number,
  ram: MappedRAMType,
  supportedSpeeds: number[],
  cpuBrand: string
): number {
  const budgetFactor = calculateBudgetFactor(budget, 0.6, 1.2)
  const isAmd = cpuBrand.toLowerCase().includes('amd')
  // 1. 计算有效速度（不超过主板支持）
  const maxSupported = Math.max(...supportedSpeeds)
  const cpuMaxSpeed = isAmd ? 6000 : ram.speed
  const effectiveSpeed = Math.min(cpuMaxSpeed, maxSupported)

  // 2. 获取当前用途的最佳容量和速度阈值
  const optimalCapacity = usageConfig.ramOptimalCapacity
  const speedThreshold = 6000
  const latencyThreshold = 30

  // 3. 计算容量分数（平滑函数）
  const capacityScore = calculateCapacityScore(
    usageConfig,
    ram.capacity,
    optimalCapacity
  )

  // 4. 计算速度分数
  const speedScore = calculateSpeedScore(
    effectiveSpeed,
    speedThreshold,
    usageConfig.ramSpeedWeight
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
  if (ram.type.toUpperCase().includes('DDR5')) techFactor *= 1.15
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
  usageConfig: UsageConfig,
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
  return baseScore + Math.log1p(excessRatio) * usageConfig.ramCapacityMultiplier
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
