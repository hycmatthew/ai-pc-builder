import { isNumber } from 'lodash'
import {
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedRAMType,
} from '../constant/mappedObjectTypes'

type BestConfiguration = {
  cpu: MappedCPUType
  motherboard: MappedMotherboardType
  ram: MappedRAMType
  gpu: MappedGPUType | null
}

function calculatePerformanceScore(
  cpuScore: number,
  gpuScore: number,
  ramScore: number,
  weights: { cpu: number; gpu: number; ram: number }
): number {
  // 使用加权几何平均反映瓶颈效应
  const totalWeight = weights.cpu + weights.gpu + weights.ram
  const weightedScore =
    Math.pow(cpuScore, weights.cpu / totalWeight) *
    Math.pow(gpuScore, weights.gpu / totalWeight) *
    Math.pow(ramScore, weights.ram / totalWeight)

  return weightedScore
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
  const motherboardsBySocket = groupMotherboardsBySocket(motherboards)
  const ramsByType = groupRamsByType(rams)
  const [sortedGPUs, gpuLookupTable] = preprocessGPUs(gpus)

  let bestScore = 0
  let bestConfig: BestConfiguration | null = null

  // 遍历所有可能的CPU
  for (const cpu of cpus) {
    // 获取兼容主板
    const compatibleMBs = motherboardsBySocket.get(cpu.socket) || []

    for (const mb of compatibleMBs) {
      // 获取兼容内存
      const compatibleRams = (ramsByType.get(mb.ramType) || [])
        .filter((ram) => ram.channel <= mb.ramSlot)
        .map((ram) => ({
          ...ram,
          score: calculateAdjustedRamScore(ram, mb.ramSupport), // 计算调整后分数
        }))

      for (const ram of compatibleRams) {
        // 计算基础成本
        const baseCost = cpu.price + mb.price + ram.price
        const remainingBudget = budget - baseCost
        if (baseCost > budget) continue

        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          const currentScore = calculatePerformanceScore(
            cpu.score,
            cpu.integratedGraphicsScore,
            ram.score,
            weights
          )
          if (currentScore > bestScore) {
            bestScore = currentScore
            bestConfig = { cpu, motherboard: mb, ram, gpu: null }
          }
        }

        // 情况2: 使用独立显卡
        if (remainingBudget >= 0) {
          const bestGPU = findBestGPU(
            sortedGPUs,
            gpuLookupTable,
            remainingBudget
          )
          if (bestGPU) {
            const currentScore = calculatePerformanceScore(
              cpu.score,
              bestGPU.score,
              ram.score,
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

// 辅助函数：按接口分组
function groupMotherboardsBySocket(mbs: MappedMotherboardType[]) {
  const map = new Map<string, MappedMotherboardType[]>()
  mbs.forEach((mb) => {
    const key = mb.socket
    map.set(key, [...(map.get(key) || []), mb])
  })
  return map
}

function groupRamsByType(rams: MappedRAMType[]) {
  const map = new Map<string, MappedRAMType[]>()
  rams.forEach((ram) => {
    const key = ram.type
    map.set(key, [...(map.get(key) || []), ram])
  })
  return map
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

// 二分查找最佳GPU
function findBestGPU(
  sortedGPUs: MappedGPUType[],
  lookupTable: number[],
  budget: number
): MappedGPUType | undefined {
  let left = 0
  let right = sortedGPUs.length - 1
  let bestIndex = -1

  // 二分查找最大可承受价格
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    if (sortedGPUs[mid].price <= budget) {
      bestIndex = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  if (bestIndex === -1) return undefined

  // 反向查找第一个达到最大分数的GPU
  const targetScore = lookupTable[bestIndex]
  for (let i = bestIndex; i >= 0; i--) {
    if (sortedGPUs[i].score === targetScore) {
      return sortedGPUs[i]
    }
  }
  return undefined
}

// 计算内存调整后分数（当主板支持超频时）
function calculateAdjustedRamScore(
  ram: MappedRAMType,
  supportedSpeeds: number[]
): number {
  // 获取主板支持的最高速度（不超过内存标称速度）
  if (!supportedSpeeds.includes(ram.speed)) {
    const maxInList = Math.max(...supportedSpeeds)
    if (!isNumber(maxInList)) {
      console.log(`supportedSpeeds not a number : ${supportedSpeeds}`)
    }
    if (ram.speed > maxInList) {
      const speedDiff = ram.speed - maxInList
      return ram.score - speedDiff
    }
  }
  return ram.score
}
