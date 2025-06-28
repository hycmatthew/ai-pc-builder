import BuildConfig from '../constant/buildConfig'
import { MappedPSUType } from '../constant/mappedObjectTypes'
import { calculateBudgetFactor } from './scoreLogic'

// 品牌评分表（可自行扩展）
const BRAND_SCORES: Record<string, number> = {
  Seasonic: 1.35,
  Corsair: 1.25,
  EVGA: 1.2,
  'be quiet!': 1.2,
  Thermaltake: 1.1,
  'Cooler Master': 1.05,
  // 其他品牌默认0.3分
  _default: 1,
}

const EFFICIENCY_FACTOR: Record<string, number> = {
  '80+ Bronze': 0.85,
  '80+ Silver': 0.88,
  '80+ Gold': 0.9,
  '80+ Platinum': 0.92,
  '80+ Titanium': 0.94,
  _default: 0.8,
}

// 效率等级映射
const EFFICIENCY_SCORE: Record<string, number> = {
  '80+ Bronze': 1.1,
  '80+ Silver': 1.2,
  '80+ Gold': 1.3,
  '80+ Platinum': 1.45,
  '80+ Titanium': 1.55,
  _default: 1,
}

const getPSUEffectiveWattage = (psu: MappedPSUType) => {
  return (
    psu.wattage *
    (EFFICIENCY_FACTOR[psu.efficiency] || EFFICIENCY_FACTOR._default)
  )
}

export const selectBestPSU = (
  psus: MappedPSUType[],
  budget: number, // 新增预算参数
  requiredWattage: number,
  maxLength: number,
  isNvidiaGPU: boolean = false
): MappedPSUType | null => {
  console.log('requiredWattage: ', requiredWattage)
  // 第一步：基础筛选（允许5%功率不足但其他参数优秀）
  const psuBudget = budget * BuildConfig.PSUFactor.PSUBudgetFactor
  const validPSUs = psus.filter(
    (psu) =>
      getPSUEffectiveWattage(psu) > requiredWattage &&
      psu.length <= maxLength &&
      psu.price < psuBudget
  )

  if (validPSUs.length === 0) return null

  // 计算预算充足系数 (1000-4000美元范围映射到1.0-1.5)
  const budgetFactor = calculateBudgetFactor(budget, 1.0, 1.5)

  // 第二步：计算基本分（性价比核心）
  const baseScored = validPSUs.map((psu) => {
    // 核心性价比公式：(预算-价格) × 有效功率 / 价格
    const priceScore = Math.sqrt(psuBudget - psu.price)
    const valueScore =
      priceScore *
      (EFFICIENCY_SCORE[psu.efficiency] || EFFICIENCY_SCORE._default)

    return {
      ...psu,
      baseScore: valueScore,
    }
  })

  // 第三步：计算额外加分项
  const fullyScored = baseScored.map((psu) => {
    // 1. 功率超出奖励 (log缩放防止过高)
    const wattageExcess = Math.max(0, psu.wattage - requiredWattage)
    const wattageBonus = Math.sqrt(Math.log1p(wattageExcess) * 0.3)
    /*
    console.log('wattageExcess:', wattageExcess)
    console.log(Math.log1p(wattageExcess))
    console.log(wattageBonus)
*/
    // 2. 模块化加分
    const modularBonus = psu.modular.toLowerCase() === 'full' ? 1.2 : 1

    // 3. 品牌加分
    const brandBonus = BRAND_SCORES[psu.brand] || BRAND_SCORES._default

    // 4. ATX3.0特别加成
    const isATX3 = psu.standard.toUpperCase().includes('ATX 3')
    let atx3Bonus = 1
    if (isATX3) {
      // NVIDIA GPU获得更高加成
      atx3Bonus = isNvidiaGPU ? 1.3 : 1.2
    }

    // 计算总加分项（根据预算因子放大）
    const extraScore =
      wattageBonus * modularBonus * brandBonus * atx3Bonus * budgetFactor

    return {
      ...psu,
      totalScore: psu.baseScore * extraScore,
    }
  })

  // 第四步：智能排序
  return fullyScored.sort((a, b) => {
    // 主要按总分排序
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore

    // 分数相同时的备选规则：
    // 1. 功率接近需求值的优先
    const aDiff = Math.abs(a.wattage - requiredWattage)
    const bDiff = Math.abs(b.wattage - requiredWattage)
    return aDiff - bDiff
  })[0]
}
