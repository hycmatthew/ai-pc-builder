import { MappedPSUType } from '../constant/mappedObjectTypes'

interface ScoredPSU extends MappedPSUType {
  score: number
}

// 品牌评分表（可自行扩展）
const BRAND_SCORES: Record<string, number> = {
  Seasonic: 1.0,
  Corsair: 0.8,
  EVGA: 0.8,
  'be quiet!': 0.7,
  Thermaltake: 0.6,
  'Cooler Master': 0.5,
  // 其他品牌默认0.3分
  _default: 0.3,
}

// 效率等级映射
const EFFICIENCY_SCORE: Record<string, number> = {
  '80+ Bronze': 1,
  '80+ Silver': 2,
  '80+ Gold': 3,
  '80+ Platinum': 4,
  _default: 0,
}

// 基础权重配置
const BASE_WEIGHTS = {
  price: 0.45, // 价格
  wattage: 0.2, // 功率
  efficiency: 0.15, // 效率
  modular: 0.1, // 模块化
  brand: 0.1, // 品牌
}

// 动态权重调整函数
const calculateDynamicWeights = (
  currentWattage: number,
  requiredWattage: number
) => {
  const wattageRatio = Math.min(currentWattage / requiredWattage, 2.5)
  const sigmoid = 1 / (1 + Math.exp(-0.6 * (wattageRatio - 1.3)))

  return {
    price: BASE_WEIGHTS.price * (1 - 0.4 * sigmoid),
    efficiency: BASE_WEIGHTS.efficiency * (1 + 0.5 * sigmoid),
    modular: BASE_WEIGHTS.modular * (1 + 0.3 * sigmoid),
    // 功率和品牌权重保持固定
    wattage: BASE_WEIGHTS.wattage,
    brand: BASE_WEIGHTS.brand,
  }
}

export const selectBestPSU = (
  psus: MappedPSUType[],
  requiredWattage: number,
  maxLength: number,
  isNvidiaGPU: boolean = false
): MappedPSUType | null => {
  // 第一步：基础筛选（允许5%功率不足但其他参数优秀）
  const validPSUs = psus.filter(
    (psu) => psu.wattage >= requiredWattage * 0.95 && psu.length <= maxLength
  )

  if (validPSUs.length === 0) return null

  // 第二步：数据预处理
  const processed = validPSUs.map((psu) => ({
    ...psu,
    priceValue: psu.price,
    efficiencyScore:
      EFFICIENCY_SCORE[psu.efficiency] ?? EFFICIENCY_SCORE._default,
    modularScore: psu.modular.toLowerCase() === 'full' ? 1 : 0,
    brandScore: BRAND_SCORES[psu.brand] ?? BRAND_SCORES._default,
  }))

  // 第三步：获取范围参数
  const prices = processed.map((p) => p.priceValue)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceRange = maxPrice - minPrice || 1

  const wattages = processed.map((p) => p.wattage)
  const maxWattage = Math.max(...wattages)
  const wattageRange = maxWattage - requiredWattage || 1

  // 第四步：动态评分
  const scoredPSUs = processed.map((psu) => {
    const dynamicWeights = calculateDynamicWeights(psu.wattage, requiredWattage)

    // 价格评分（非线性处理）
    const priceScore = Math.pow((maxPrice - psu.priceValue) / priceRange, 1.8)

    // 效率评分
    const efficiencyScore = psu.efficiencyScore / 4

    // 功率评分（仅计算超出部分）
    const wattageBonus = Math.max(psu.wattage - requiredWattage, 0)
    const wattageScore = Math.log1p(wattageBonus) / Math.log1p(wattageRange)

    // 品牌评分
    const brandScore = psu.brandScore

    // 综合得分
    let totalScore =
      dynamicWeights.price * priceScore +
      dynamicWeights.efficiency * efficiencyScore +
      dynamicWeights.modular * psu.modularScore +
      dynamicWeights.wattage * wattageScore +
      dynamicWeights.brand * brandScore

    // NVIDIA GPU專用加成
    const isATX3 = psu.standard.toUpperCase().includes('ATX 3')
    totalScore
    if (isNvidiaGPU) {
      totalScore *= isATX3 ? 1.5 : 1
    } else {
      totalScore *= isATX3 ? 1.2 : 1
    }

    return { ...psu, score: totalScore }
  }) as ScoredPSU[]

  // 第五步：智能排序
  return scoredPSUs.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score

    // 分数相同时的备选规则：
    // 1. 功率接近需求值的优先
    const aDiff = Math.abs(a.wattage - requiredWattage)
    const bDiff = Math.abs(b.wattage - requiredWattage)
    return aDiff - bDiff
  })[0]
}
