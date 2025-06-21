import {
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedRAMType,
} from '../constant/mappedObjectTypes'
import { RAM_BRAND_FACTOR } from '../constant/buildType'

type BestConfiguration = {
  cpu: MappedCPUType
  motherboard: MappedMotherboardType
  ram: MappedRAMType
  gpu: MappedGPUType | null
}

// 改进性能评分计算
function calculatePerformanceScore(
  cpuScore: number,
  gpuScore: number,
  ramScore: number,
  mbScore: number,
  weights: { cpu: number; gpu: number; ram: number }
): number {
  // 處理瓶頸效應：計算CPU/GPU平衡因子（0.5~1.0）
  const updateCpuScore = cpuScore / weights.cpu
  const updateGpuScore = gpuScore / weights.gpu
  const minPerf = Math.min(updateCpuScore, updateGpuScore)
  const maxPerf = Math.max(updateCpuScore, updateGpuScore)

  // 瓶頸調整係數：性能差距越大，懲罰越強
  const bottleneckFactor = minPerf / maxPerf // [0,1]

  // 平衡補償係數：當性能匹配時給予獎勵
  const balanceBonus = 0.5 * (1 + bottleneckFactor) // [0.5,1]

  // 計算瓶頸調整後的CPU/GPU組合分數
  const adjustedCpuGpu =
    (cpuScore * weights.cpu + gpuScore * weights.gpu) * balanceBonus

  // 計算其他組件分數（RAM按權重，主板固定5%）
  const ramComponent = ramScore * weights.ram
  const mbComponent = mbScore * 0.05

  // 組合總分（確保非負）
  return Math.max(0, adjustedCpuGpu + ramComponent + mbComponent)
}

export const findBestConfiguration = (
  cpus: MappedCPUType[],
  gpus: MappedGPUType[],
  motherboards: MappedMotherboardType[],
  rams: MappedRAMType[],
  budget: number,
  weights: { cpu: number; gpu: number; ram: number }
) => {
  // 预处理数据结构
  const ramsByType = groupRamsByType(rams)
  const [sortedGPUs, gpuLookupTable] = preprocessGPUs(gpus)

  // 按性能/价格比排序CPU
  const sortedCPUs = [...cpus].sort(
    (a, b) => b.score / b.price - a.score / a.price
  )

  let bestScore = 0
  let bestConfig: BestConfiguration | null = null

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
          score: calculateRamPerformance(ram, mb.ramSupport),
          valueRatio: ram.score / ram.price, // 添加性价比指标
        }))
        // 按性价比排序内存
        .sort((a, b) => b.valueRatio - a.valueRatio)

      for (const ram of compatibleRams) {
        const baseCost = cpu.price + mb.price + ram.price
        if (baseCost > budget) continue

        // 计算CPU实际性能
        const effectiveCPUScore = cpu.score * (0.9 + 0.1 * mb.score)

        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          const currentScore = calculatePerformanceScore(
            effectiveCPUScore,
            cpu.integratedGraphicsScore,
            ram.score,
            mb.score,
            weights
          )
          if (currentScore > bestScore) {
            bestScore = currentScore
            bestConfig = { cpu, motherboard: mb, ram, gpu: null }
          }
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
            const currentScore = calculatePerformanceScore(
              effectiveCPUScore,
              bestGPU.score,
              ram.score,
              mb.score,
              weights
            )
            if (currentScore > bestScore) {
              bestScore = currentScore
              bestConfig = { cpu, motherboard: mb, ram, gpu: bestGPU }
            }
          }
        }
      }
    }
  }
  return bestConfig
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
  ram: MappedRAMType,
  supportedSpeeds: number[]
): number {
  // 1. 计算有效速度（不超过主板支持）
  const maxSupported = Math.max(...supportedSpeeds)
  const effectiveSpeed = Math.min(ram.speed, maxSupported)

  // 2. 容量权重：分段加权
  const getCapacityWeight = (capacity: number) => {
    if (capacity <= 8) return 0.5
    if (capacity <= 16) return 0.8
    if (capacity <= 32) return 1.1
    if (capacity <= 64) return 1.15
    return 0.8
  }

  // 3. 通道数乘数
  const getChannelMultiplier = (channel: number) => {
    return channel >= 2 ? 1.2 : 1.0
  }

  // 4. 计算真实延迟（纳秒）
  const realLatencyNs = (ram.latency / effectiveSpeed) * 2000

  // 5. 延迟惩罚系数（非线性）
  const getLatencyPenalty = (latencyNs: number) => {
    if (latencyNs <= 10) return 0
    if (latencyNs <= 15) return 80
    if (latencyNs <= 20) return 150
    return 220
  }

  // 6. 基础分计算
  const baseScore = effectiveSpeed * getCapacityWeight(ram.capacity)

  // 7. 应用通道数加成
  const channelBoostedScore = baseScore * getChannelMultiplier(ram.channel)

  // 8. 应用延迟惩罚
  let finalScore =
    channelBoostedScore - realLatencyNs * getLatencyPenalty(realLatencyNs)

  // 9. DDR5加成 (15%性能提升)
  if (ram.type.toUpperCase().includes('DDR5')) {
    finalScore *= 1.1
  }

  // 10. 散热片加成 (5%性能提升)
  if (ram.hasHeatsink) {
    finalScore *= 1.1
  }

  // 11. 品牌加成
  const brand = ram.brand.toUpperCase().trim()
  const brandFactor = RAM_BRAND_FACTOR[brand] || RAM_BRAND_FACTOR._default
  finalScore *= brandFactor

  return Math.max(0, finalScore)
}
