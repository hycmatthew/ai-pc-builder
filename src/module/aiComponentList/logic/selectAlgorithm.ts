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
  const ramsByType = groupRamsByType(rams)
  const [sortedGPUs, gpuLookupTable] = preprocessGPUs(gpus)

  let bestScore = 0
  let bestConfig: BestConfiguration | null = null

  // 遍历所有可能的CPU
  for (const cpu of cpus) {
    // 获取兼容主板
    const compatibleMBs = motherboards
      .filter((mb) => mb.socket === cpu.socket)
      .filter((mb) => mb.price <= budget * 0.3) // 主板不超过总预算30%

    if (compatibleMBs.length === 0) continue

    const scoredMBs = preprocessMotherboards(compatibleMBs, cpu, budget)

    // 只考虑前20%的主板，平衡性能和时间效率
    const topMBs = scoredMBs.slice(0, Math.ceil(scoredMBs.length * 0.4))

    for (const mb of topMBs) {
      if (cpu.price + mb.price > budget * 0.7) continue
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

        // 計算CPU實際性能 (加入主板品質因子)
        const effectiveCPUScore = cpu.score * (0.9 + 0.1 * mb.score)

        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          const currentScore = calculatePerformanceScore(
            effectiveCPUScore,
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
              effectiveCPUScore,
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

// 芯片组等级映射（基于命名规则）
const CHIPSET_POWER_RANK: Record<
  string,
  { rank: number; powerSupport: number; class: number; generation: number }
> = {
  Z890: { rank: 1.0, powerSupport: 300, class: 4, generation: 800 },
  Z790: { rank: 0.98, powerSupport: 280, class: 4, generation: 700 },
  Z690: { rank: 0.95, powerSupport: 270, class: 4, generation: 600 },
  H770: { rank: 0.85, powerSupport: 220, class: 3, generation: 700 },
  B860: { rank: 0.82, powerSupport: 200, class: 3, generation: 800 },
  B760: { rank: 0.8, powerSupport: 190, class: 3, generation: 700 },
  H670: { rank: 0.78, powerSupport: 180, class: 3, generation: 600 },
  B660: { rank: 0.75, powerSupport: 170, class: 3, generation: 600 },
  H610: { rank: 0.65, powerSupport: 120, class: 2, generation: 600 },
  X870: { rank: 1.0, powerSupport: 300, class: 4, generation: 800 },
  X670: { rank: 0.95, powerSupport: 280, class: 4, generation: 600 },
  B850: { rank: 0.85, powerSupport: 220, class: 3, generation: 800 },
  B650: { rank: 0.8, powerSupport: 200, class: 3, generation: 600 },
  B840: { rank: 0.75, powerSupport: 180, class: 2, generation: 800 },
  A620: { rank: 0.65, powerSupport: 130, class: 2, generation: 600 },
}

// 芯片組命名規則解析（保持不變）
const CHIPSET_RULES = {
  intel: {
    Z: {
      baseClass: 4,
      rankModifier: 1.0,
      powerBase: 300,
      generationFactor: 0.02,
    },
    H: {
      baseClass: 3,
      rankModifier: 0.8,
      powerBase: 180,
      generationFactor: 0.01,
    },
    B: {
      baseClass: 3,
      rankModifier: 0.8,
      powerBase: 180,
      generationFactor: 0.01,
    },
    W: {
      baseClass: 5,
      rankModifier: 1.1,
      powerBase: 350,
      generationFactor: 0.03,
    },
  },
  amd: {
    X: {
      baseClass: 4,
      rankModifier: 1.0,
      powerBase: 300,
      generationFactor: 0.02,
    },
    B: {
      baseClass: 3,
      rankModifier: 0.8,
      powerBase: 180,
      generationFactor: 0.01,
    },
    A: {
      baseClass: 2,
      rankModifier: 0.7,
      powerBase: 130,
      generationFactor: 0.005,
    },
  },
}

// 品牌评分映射表（更新）
const BRAND_POWER_SCORE: Record<string, number> = {
  asus: 1.1, // 一线品牌
  msi: 1.05, // 一线品牌
  gigabyte: 1.0, // 准一线
  asrock: 0.95, // 二线品牌 -5%
  biostar: 0.9, // 三线品牌 -10%
  colorful: 0.9, // 三线品牌 -10%
  _default: 1.0,
}

// 尺寸惩罚系数（更新）
const FORM_FACTOR_PENALTY: Record<string, number> = {
  'MINI-ITX': 0.85, // 扣15%分
  'MICRO-ATX': 0.95, // 扣5%分
  ATX: 1.0, // 不扣分
  'E-ATX': 0.95,
}

// 获取芯片组数据（带智能规则）
function getChipsetData(chipset: string): {
  rank: number
  powerSupport: number
  class: number
  generation: number
} {
  const upperChipset = chipset.toUpperCase().trim()
  let result: {
    rank: number
    powerSupport: number
    class: number
    generation: number
  }

  // 檢查是否在預定義映射中
  if (CHIPSET_POWER_RANK[upperChipset]) {
    result = CHIPSET_POWER_RANK[upperChipset]
  } else {
    // 解析芯片組名稱
    const match = upperChipset.match(/^([A-Z])(\d{2,3})([A-Z]?)$/)
    if (!match) {
      // 無效格式，返回默認值
      result = { rank: 0.8, powerSupport: 150, class: 3, generation: 0 }
    } else {
      const prefix = match[1]
      const numberPart = parseInt(match[2])
      const generation = Math.floor(numberPart / 100) * 100

      // 確定製造商
      const isIntel = generation >= 600 && generation < 900
      const rules = isIntel ? CHIPSET_RULES.intel : CHIPSET_RULES.amd

      // 查找規則
      const ruleKey = Object.keys(rules).find((k) => k === prefix) as
        | keyof typeof rules
        | undefined
      if (!ruleKey) {
        // 未知前綴，返回默認值
        result = { rank: 0.8, powerSupport: 150, class: 3, generation }
      } else {
        const rule = rules[ruleKey]
        let finalRank =
          rule.rankModifier + rule.generationFactor * (generation / 100)

        // 特殊處理 H 系列
        if (prefix === 'H' && numberPart < 650) {
          finalRank -= 0.15
        }

        result = {
          rank: finalRank,
          powerSupport: rule.powerBase + generation / 10,
          class: rule.baseClass,
          generation,
        }
      }
    }
  }

  return result
}

// CPU等级划分标准 (基于型号名称和TDP)
function getCpuClass(cpu: MappedCPUType): number {
  const name = cpu.id.toUpperCase()
  // 定义CPU等级映射规则
  const cpuClassRules = [
    {
      // 旗舰级 (i9/Ryzen 9/Core Ultra 9)
      keywords: ['I9', 'RYZEN-9', 'ULTRA-9'],
      minPower: 200,
      class: 5,
    },
    {
      // 高端级 (i7/Ryzen 7/Core Ultra 7)
      keywords: ['I7', 'RYZEN-7', 'ULTRA-7'],
      minPower: 150,
      class: 4,
    },
    {
      // 中端级 (i5/Ryzen 5/Core Ultra 5)
      keywords: ['I5', 'RYZEN-5', 'ULTRA-5'],
      minPower: 100,
      class: 3,
    },
    {
      // 入门级 (i3/Ryzen 3)
      keywords: ['I3-', 'RYZEN 3'],
      minPower: 0,
      class: 2,
    },
  ]
  // 按优先级检查规则
  for (const rule of cpuClassRules) {
    const hasKeyword = rule.keywords.some((keyword) => name.includes(keyword))
    const hasPower = cpu.power > rule.minPower

    if (hasKeyword || hasPower) {
      return rule.class
    }
  }
  return 1 // 默认低功耗/入门级
}

// 主板等级评分函数（优化版）
const rateMotherboard = (
  mb: MappedMotherboardType,
  cpu: MappedCPUType,
  budget: number
): number => {
  // 获取芯片组数据
  const chipsetData = getChipsetData(mb.chipset)
  const cpuClass = getCpuClass(cpu)

  // 1. 价格价值比 (性价比计算) - 50% 权重
  const maxMBPrice = budget * 0.3
  const priceValue = 1 - Math.min(1, mb.price / maxMBPrice)

  // 2. 品牌质量系数 - 15% 权重
  const brand = mb.brand.toUpperCase().trim()
  const brandFactor = BRAND_POWER_SCORE[brand] || BRAND_POWER_SCORE._default

  // 3. CPU-主板等级匹配 - 20% 权重
  let classMatch = 1.0
  const classDiff = cpuClass - chipsetData.class

  if (classDiff >= 2) {
    // 高端CPU配低端主板：严重惩罚
    classMatch = 0.4
  } else if (classDiff === 1) {
    // CPU比主板高一级：轻微惩罚
    classMatch = 0.8
  } else if (classDiff <= -1) {
    // 主板比CPU高级：小奖励
    classMatch = 1.1
  } else if (classDiff === 0) {
    // 完美匹配
    classMatch = 1.2
  }

  // 4. 供电能力匹配（考虑芯片组和品牌） - 10% 权重
  let powerMatch = 1.0
  const requiredPower = cpu.power * 1.2 // 20%余量
  const effectivePower = chipsetData.powerSupport * brandFactor

  if (effectivePower < requiredPower * 0.8) {
    powerMatch = 0.5 // 严重不足
  } else if (effectivePower < requiredPower) {
    powerMatch = 0.8 // 基本满足
  } else {
    powerMatch = 1.1 // 超额供电奖励
  }

  // 5. 代数奖励（较新芯片组加分） - 5% 权重
  const generationBonus = Math.min(0.1, chipsetData.generation / 10000) // 每100代=0.01

  // 6. 主板尺寸调整
  const formFactor = mb.formFactor.toUpperCase().trim()
  const formFactorPenalty = FORM_FACTOR_PENALTY[formFactor] || 1.0

  // 最终加权计算
  const baseScore =
    priceValue * 0.5 +
    brandFactor * 0.15 +
    classMatch * 0.2 +
    powerMatch * 0.1 +
    generationBonus * 0.05

  return baseScore * formFactorPenalty
}

// 优化预处理函数
const preprocessMotherboards = (
  mbs: MappedMotherboardType[],
  cpu: MappedCPUType,
  budget: number
) => {
  // 基础兼容性过滤
  let compatibleMBs = mbs.filter(
    (mb) => mb.socket === cpu.socket && mb.price <= budget * 0.3 // 主板不超过总预算30%
  )

  // 获取CPU等级
  const cpuClass = getCpuClass(cpu)

  // 高端CPU特殊处理（i9/Ryzen 9）
  if (cpuClass >= 5) {
    compatibleMBs = compatibleMBs.filter((mb) => {
      const chipsetData = getChipsetData(mb.chipset)
      // 必须高端芯片组且供电充足
      return (
        chipsetData.class >= 4 && chipsetData.powerSupport >= cpu.power * 1.1
      )
    })
  }

  // 中高端CPU过滤（i7/Ryzen 7）
  else if (cpuClass >= 4) {
    compatibleMBs = compatibleMBs.filter((mb) => {
      const chipsetData = getChipsetData(mb.chipset)
      // 禁止入门级芯片组，供电要求放宽
      return (
        chipsetData.class >= 3 && chipsetData.powerSupport >= cpu.power * 0.9
      )
    })
  }

  return compatibleMBs
    .map((mb) => ({
      ...mb,
      // 动态计算针对特定CPU的评分
      score: rateMotherboard(mb, cpu, budget),
    }))
    .sort((a, b) => b.score - a.score) // 按评分降序排序
}
