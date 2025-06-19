import { MotherboardType } from '../../../constant/objectTypes'
import {
  BRAND_POWER_SCORE,
  CHIPSET_POWER_RANK,
  CHIPSET_RULES,
  FORM_FACTOR_PENALTY,
  MOTHERBOARD_SERIES_FACTOR,
} from '../constant/buildType'

const chipsetDataCache = new Map<
  string,
  {
    rank: number
    powerSupport: number
    class: number
    generation: number
  }
>()

export function calculateMotherboardBaseScore(mb: MotherboardType): number {
  const chipsetData = getChipsetData(mb.chipset)

  // 1. 芯片组性能分数 (40%)
  const chipsetScore = chipsetData.rank * 0.4

  // 2. 代数奖励 (10%)
  const generationBonus = Math.min(0.1, chipsetData.generation / 10000) * 0.1

  // 3. 内存支持评分 (50%)
  const maxSupportedSpeed = Math.max(...mb.ram_support)
  const ramSupportScore =
    calculateRamSupportScore(maxSupportedSpeed, mb.ram_type) * 0.5

  // 基础分数 = 芯片组性能(40%) + 代数奖励(10%) + 内存支持(50%)
  let baseScore = chipsetScore + generationBonus + ramSupportScore

  // 4. 品牌系列系数
  const seriesFactor = getMotherboardSeriesFactor(mb.name)

  // 5. 品牌质量系数
  const brand = mb.brand.toUpperCase().trim()
  const brandFactor = BRAND_POWER_SCORE[brand] || BRAND_POWER_SCORE._default

  // 6. 主板尺寸调整
  const formFactor = mb.form_factor.toUpperCase().trim()
  const formFactorPenalty = FORM_FACTOR_PENALTY[formFactor] || 1.0

  // 静态分数 = 基础分数 * 品牌系列系数 * 品牌质量系数 * 尺寸惩罚
  return baseScore * seriesFactor * brandFactor * formFactorPenalty
}

// 优化3: 重构芯片组数据处理逻辑
export function getChipsetData(chipset: string) {
  const upperChipset = chipset.toUpperCase().trim()

  // 检查缓存
  if (chipsetDataCache.has(upperChipset)) {
    return chipsetDataCache.get(upperChipset)!
  }

  // 检查预定义映射
  if (CHIPSET_POWER_RANK[upperChipset]) {
    chipsetDataCache.set(upperChipset, CHIPSET_POWER_RANK[upperChipset])
    return CHIPSET_POWER_RANK[upperChipset]
  }

  // 解析芯片组名称
  const match = upperChipset.match(/^([A-Z])(\d{2,3})([A-Z]?)$/)
  if (!match) {
    const result = { rank: 0.8, powerSupport: 150, class: 3, generation: 0 }
    chipsetDataCache.set(upperChipset, result)
    return result
  }

  const prefix = match[1]
  const numberPart = parseInt(match[2])
  const generation = Math.floor(numberPart / 100) * 100
  const isIntel = generation >= 600 && generation < 900
  const rules = isIntel ? CHIPSET_RULES.intel : CHIPSET_RULES.amd
  const ruleKey = Object.keys(rules).find((k) => k === prefix) as
    | keyof typeof rules
    | undefined

  if (!ruleKey) {
    const result = { rank: 0.8, powerSupport: 150, class: 3, generation }
    chipsetDataCache.set(upperChipset, result)
    return result
  }

  const rule = rules[ruleKey]
  let finalRank = rule.rankModifier + rule.generationFactor * (generation / 100)

  // 特殊处理 H 系列
  if (prefix === 'H' && numberPart < 650) {
    finalRank -= 0.15
  }

  const result = {
    rank: finalRank,
    powerSupport: rule.powerBase + generation / 10,
    class: rule.baseClass,
    generation,
  }

  chipsetDataCache.set(upperChipset, result)
  return result
}

// 计算内存支持评分
function calculateRamSupportScore(maxSpeed: number, ramType: string): number {
  // DDR5基础评分更高
  const isDDR5 = ramType.toUpperCase().includes('DDR5')
  const baseScore = isDDR5 ? 0.7 : 0.5 // DDR5基础评分更高

  // 内存速度评分（非线性增长）
  const speedScore = Math.min(1.0, Math.log10(maxSpeed / 1600) * 0.5)

  // 支持高频内存的额外奖励
  let highSpeedBonus = 0
  if (isDDR5 && maxSpeed >= 6000) {
    highSpeedBonus = (0.2 * (maxSpeed - 6000)) / 2000 // 每增加2000MHz奖励0.2
  } else if (!isDDR5 && maxSpeed >= 4000) {
    highSpeedBonus = (0.15 * (maxSpeed - 4000)) / 1000 // 每增加1000MHz奖励0.15
  }

  return Math.min(1.0, baseScore + speedScore + highSpeedBonus)
}

// 获取主板系列系数
function getMotherboardSeriesFactor(modelName: string): number {
  const upperModel = modelName.toUpperCase()

  // 检查预定义的系列关键词
  for (const [series, factor] of Object.entries(MOTHERBOARD_SERIES_FACTOR)) {
    if (upperModel.includes(series)) {
      return factor
    }
  }

  return MOTHERBOARD_SERIES_FACTOR._default
}
