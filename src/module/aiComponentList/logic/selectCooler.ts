import BuildConfig from '../constant/buildConfig'
import { COOLER_BRAND_SCORES } from '../constant/buildType'
import {
  MappedCPUType,
  MappedCaseType,
  MappedCoolerType,
} from '../constant/mappedObjectTypes'
import { calculateBudgetFactor } from './scoreLogic'

export const calculateIdealCoolerPrice = (
  cpuPrice: number,
  budget: number
): number => {
  const budgetRatio = calculateBudgetFactor(
    budget,
    BuildConfig.CoolerFactor.IdealPriceFactors.lowBudgetRatio,
    BuildConfig.CoolerFactor.IdealPriceFactors.highBudgetRatio
  )
  const idealPrice =
    cpuPrice * BuildConfig.CoolerFactor.IdealPriceFactors.cpuRatio +
    budget * budgetRatio

  return idealPrice
}

export const selectBestCooler = (
  selectedCPU: MappedCPUType,
  selectedCase: MappedCaseType,
  coolerPool: MappedCoolerType[],
  budget: number // 新增預算參數
): MappedCoolerType | null => {
  const cpuTDP = selectedCPU.power
  const cpuPrice = selectedCPU.price

  // 1. 計算理想價格
  const idealPrice = calculateIdealCoolerPrice(cpuPrice, budget)

  // 2. 根據CPU的TDP選擇推薦散熱器級別
  const recommendedCoolerIds =
    cpuTDP > BuildConfig.CoolerFactor.TDPThreshold
      ? BuildConfig.CoolerFactor.HighendCoolerSuggestion
      : BuildConfig.CoolerFactor.NormalCoolerSuggestion

  // 3. TDP因子（TDP越高，散熱器權重越高）
  const tdpFactor = 1 + (cpuTDP / 200) * 0.5 // 每100W TDP增加25%權重

  // 4. 篩選兼容散熱器
  const compatibleCoolers = coolerPool.filter((cooler) =>
    validateCoolerCompatibility(cooler, selectedCPU, selectedCase)
  )

  if (compatibleCoolers.length === 0) return null

  // 5. 評分系統
  const budgetFactor = calculateBudgetFactor(budget, 1.0, 1.5)
  const scoredCoolers = compatibleCoolers.map((cooler) => {
    // 核心改進：價格分數基於與理想價格的接近程度
    const priceDifference = Math.abs(cooler.price - idealPrice)

    // 價格分數計算（基於預算因子的動態容忍度）
    let priceScore
    if (cooler.price <= idealPrice) {
      // 低於理想價格的扣分較輕（尤其當預算低時）
      priceScore = 1 - (priceDifference / idealPrice) * (0.5 / budgetFactor)
    } else {
      // 高於理想價格的扣分較重（尤其當預算低時）
      priceScore = 1 - (priceDifference / idealPrice) * (1.5 * budgetFactor)
    }

    // 確保分數在合理範圍內
    priceScore = Math.max(0.1, Math.min(1.5, priceScore))

    // 推薦等級加成
    const isRecommended = recommendedCoolerIds.includes(cooler.id)
    const recommendationBonus = isRecommended ? 1 : 0.9

    // 品牌加成
    const brandBonus =
      COOLER_BRAND_SCORES[cooler.brand] || COOLER_BRAND_SCORES._default

    // 散熱類型加成（水冷 > 風冷）
    const typeBonus = cooler.isLiquidCooler ? 1.15 : 1

    // 噪音等級加成

    // 計算總分
    const totalScore =
      priceScore * recommendationBonus * brandBonus * tdpFactor * typeBonus

    return {
      ...cooler,
      totalScore,
    }
  })

  // 6. 按總分排序（優先推薦散熱器）
  scoredCoolers.sort((a, b) => {
    // 優先推薦散熱器
    const aRecommended = recommendedCoolerIds.includes(a.id)
    const bRecommended = recommendedCoolerIds.includes(b.id)

    if (aRecommended && !bRecommended) return -1
    if (!aRecommended && bRecommended) return 1

    // 同為推薦或非推薦時按總分排序
    return b.totalScore - a.totalScore
  })

  // 返回排序後的第一個散熱器（最佳選擇），如果沒有則返回 null
  return scoredCoolers.length > 0 ? scoredCoolers[0] : null
}

// 獨立兼容性驗證函式
const validateCoolerCompatibility = (
  cooler: MappedCoolerType,
  cpu: MappedCPUType,
  caze: MappedCaseType
): boolean => {
  // CPU插槽匹配驗證
  const socketMatch = cooler.sockets?.includes(cpu.socket) ?? false

  // 機箱兼容性驗證
  let caseFit = true
  if (cooler.isLiquidCooler) {
    caseFit = cooler.liquidCoolerSize <= caze.radiatorSupport
  } else {
    caseFit = cooler.airCoolerHeight <= caze.maxCpuCoolorHeight
  }

  return socketMatch && caseFit
}
