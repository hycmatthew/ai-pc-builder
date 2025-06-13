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

// 品牌评分映射表
const BRAND_POWER_SCORE: Record<string, number> = {
  ASUS: 1.0, // 一线品牌
  MSI: 1.0, // 一线品牌
  GIGABYTE: 0.9, // 准一线
  ASROCK: 0.85, // 二线品牌
  BIOSTAR: 0.8, // 三线品牌
  COLORFUL: 0.8, // 三线品牌
  // 默认评分
  _default: 0.85,
}

// CPU等级划分标准 (基于型号名称)
function getCpuClass(cpuName: string): number {
  // 优先检测旗舰型号
  if (cpuName.includes('i9-') || cpuName.includes('Ryzen 9')) return 5
  if (cpuName.includes('i7-') || cpuName.includes('Ryzen 7')) return 4
  if (cpuName.includes('i5-') || cpuName.includes('Ryzen 5')) return 3
  if (cpuName.includes('i3-') || cpuName.includes('Ryzen 3')) return 2
  return 1 // 入门级
}

// 芯片组等级映射（基于命名规则）
const CHIPSET_POWER_RANK: Record<
  string,
  { rank: number; powerSupport: number; class: number }
> = {
  // 特殊处理例外情况
  H610: { rank: 0.7, powerSupport: 120, class: 1 },
  H670: { rank: 0.9, powerSupport: 220, class: 3 },

  // 其他芯片组使用规则生成
}

// 芯片组命名规则解析
interface ChipsetRule {
  prefix: string
  baseClass: number
  rankModifier: number
  powerBase: number
  generationFactor: number // 代数加成系数
}

const CHIPSET_RULES = {
  intel: {
    Z: {
      prefix: 'Z',
      baseClass: 4,
      rankModifier: 1.0,
      powerBase: 300,
      generationFactor: 0.05,
    } as ChipsetRule,
    H: {
      prefix: 'H',
      baseClass: 2,
      rankModifier: 0.85,
      powerBase: 180,
      generationFactor: 0.04,
    } as ChipsetRule, // 默认H系列为中端
    B: {
      prefix: 'B',
      baseClass: 2,
      rankModifier: 0.85,
      powerBase: 180,
      generationFactor: 0.04,
    } as ChipsetRule,
    W: {
      prefix: 'W',
      baseClass: 5,
      rankModifier: 1.1,
      powerBase: 350,
      generationFactor: 0.06,
    } as ChipsetRule,
  },
  amd: {
    X: {
      prefix: 'X',
      baseClass: 4,
      rankModifier: 1.0,
      powerBase: 300,
      generationFactor: 0.05,
    } as ChipsetRule,
    B: {
      prefix: 'B',
      baseClass: 2,
      rankModifier: 0.85,
      powerBase: 180,
      generationFactor: 0.04,
    } as ChipsetRule,
    A: {
      prefix: 'A',
      baseClass: 1,
      rankModifier: 0.7,
      powerBase: 120,
      generationFactor: 0.03,
    } as ChipsetRule,
  },
}

// 获取芯片组数据（带智能规则）
function getChipsetData(chipset: string) {
  const upperChipset = chipset.toUpperCase()

  // 1. 检查特殊处理项
  if (CHIPSET_POWER_RANK[upperChipset]) {
    return CHIPSET_POWER_RANK[upperChipset]
  }

  // 2. 解析芯片组名称
  const match = upperChipset.match(/^([A-Z])(\d{2,3})$/)
  if (!match) return { rank: 0.8, powerSupport: 150, class: 2 }

  const prefix = match[1]
  const numberPart = parseInt(match[2])
  const generation = Math.floor(numberPart / 100) // 提取代数 (800,700,600等)
  const series = numberPart % 100 // 提取系列 (80,70,60等)

  // 3. 确定厂商规则集
  const isIntel = generation >= 6 // Intel 通常600系列起
  const rules = isIntel ? CHIPSET_RULES.intel : CHIPSET_RULES.amd
  const rule =
    prefix in rules
      ? rules[prefix as keyof typeof rules]
      : rules[Object.keys(rules)[0] as keyof typeof rules]

  // 4. 计算等级和性能
  const classValue = Math.min(5, rule.baseClass + Math.floor(series / 20))
  const generationBonus = rule.generationFactor * generation

  return {
    rank: rule.rankModifier + generationBonus,
    powerSupport: rule.powerBase + generation * 10,
    class: classValue,
  }
}

const FORM_FACTOR_PENALTY: Record<string, number> = {
  'Mini-ITX': 0.85, // 扣15%分
  'Micro-ATX': 0.95, // 扣5%分
  ATX: 1.0, // 不扣分
  'E-ATX': 1.0, // 不扣分
}

// 主板等级评分函数
const rateMotherboard = (
  mb: MappedMotherboardType,
  cpu: MappedCPUType,
  budget: number
): number => {
  // 获取芯片组数据
  const chipsetData = getChipsetData(mb.chipset)

  // 1. 价格价值比 (性价比计算)
  const priceValue = 1 - Math.min(1, mb.price / (budget * 0.2))

  // 2. 品牌质量系数
  const brandFactor = BRAND_POWER_SCORE[mb.brand.toUpperCase()] || 0.85

  // 3. CPU-主板等级匹配
  const cpuClass = getCpuClass(cpu.name)
  let classMatch = 1.0

  // 等级匹配规则
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
  }

  // 4. 供电能力匹配（考虑芯片组和品牌）
  let powerMatch = 1.0
  const requiredPower = cpu.power * 1.1 // 10%余量
  const effectivePower = chipsetData.powerSupport * brandFactor

  if (effectivePower < requiredPower * 0.8) {
    powerMatch = 0.5 // 严重不足
  } else if (effectivePower < requiredPower) {
    powerMatch = 0.8 // 基本满足
  } else {
    powerMatch = 1.1 // 超额供电奖励
  }

  // 5. 代数奖励（较新芯片组加分）
  // const generationBonus = chipsetData.rank - chipsetData.rankModifier;

  // 9. 主板尺寸调整
  const formFactorPenalty = FORM_FACTOR_PENALTY[mb.formFactor] || 1.0

  // 5. 最终加权计算
  return (
    (priceValue * 0.5 +
      brandFactor * 0.2 +
      classMatch * 0.25 +
      powerMatch * 0.15) *
    formFactorPenalty
  )
}

// 修改预处理函数
const preprocessMotherboards = (
  mbs: MappedMotherboardType[],
  cpu: MappedCPUType,
  budget: number
) => {
  // 基础兼容性过滤
  let compatibleMBs = mbs.filter((mb) => mb.socket === cpu.socket)

  // 获取CPU等级
  const cpuClass = getCpuClass(cpu.name)

  // 高端CPU特殊处理（i9/Ryzen 9）
  if (cpuClass >= 5) {
    compatibleMBs = compatibleMBs.filter((mb) => {
      const chipsetData = getChipsetData(mb.chipset)
      return chipsetData.class >= 4 // 必须高端芯片组
    })
  }

  // 中高端CPU过滤（i7/Ryzen 7）
  else if (cpuClass >= 4) {
    compatibleMBs = compatibleMBs.filter((mb) => {
      const chipsetData = getChipsetData(mb.chipset)
      return chipsetData.class >= 3 // 禁止入门级芯片组
    })
  }

  // 价格上限过滤 (主板不超过总预算25%)
  compatibleMBs = compatibleMBs.filter((mb) => mb.price <= budget * 0.25)

  return compatibleMBs
    .map((mb) => ({
      ...mb,
      // 动态计算针对特定CPU的评分
      score: rateMotherboard(mb, cpu, budget),
    }))
    .sort((a, b) => b.score - a.score) // 按评分降序排序
}
