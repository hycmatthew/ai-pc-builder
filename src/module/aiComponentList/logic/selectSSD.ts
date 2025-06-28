import BuildConfig from '../constant/buildConfig'
import { MappedSSDType } from '../constant/mappedObjectTypes'
import { calculateBudgetFactor } from './scoreLogic'

interface Weights {
  recommended: number
  price: number
  performance: number
  flashTypeQLC: number
  brand: number
}

const SSD_BASE_WEIGHTS = {
  price: 0.4,
  performance: 0.35,
  recommended: 0.15,
  brand: 0.1,
  flashTypeQLC: 0,
}

// 品牌加分配置
const SSD_BRAND_BONUS: Record<string, number> = {
  samsung: 1,
  crucial: 0.9,
  westerndigital: 0.9,
  zhitai: 0.9,
  kingston: 0.8,
  solidigm: 0.7,
  corsair: 0.7,
  lexar: 0.6,
  _default: 0.5,
}

export const selectBestSSD = (
  ssds: MappedSSDType[],
  suggestedSSDs: string[],
  budget: number, // 新增预算参数
  weights: Weights = SSD_BASE_WEIGHTS
): MappedSSDType | null => {
  const ssdBudget = budget * BuildConfig.SSDFactor.SSDBudgetFactor
  if (ssds.length === 0) return null

  // 2. 计算预算影响因子
  const budgetFactor = calculateBudgetFactor(
    budget,
    0.8, // 低预算时倾向性价比
    1.2 // 高预算时倾向性能
  )

  // 3. 动态调整权重（预算越高，性能权重越大）
  const dynamicWeights = {
    ...weights,
    price: weights.price * (2 - budgetFactor), // 预算越高，价格权重越低
    performance: weights.performance * budgetFactor, // 预算越高，性能权重越高
  }

  // 4. 计算性能指标范围
  const maxRead = Math.max(...ssds.map((ssd) => ssd.maxRead))
  const maxWrite = Math.max(...ssds.map((ssd) => ssd.maxWrite))
  const maxRead4K = Math.max(...ssds.map((ssd) => ssd.read4K))
  const maxWrite4K = Math.max(...ssds.map((ssd) => ssd.write4K))

  // 5. 计算基本分（核心性价比）
  const baseScored = ssds.map((ssd) => {
    // 价格得分（非线性处理，低价产品得分更高）
    const priceRatio = Math.max(0.1, (ssdBudget - ssd.price) / ssdBudget)
    const priceScore = Math.sqrt(priceRatio) * dynamicWeights.price
    const recommendedBonus = suggestedSSDs.includes(ssd.series) ? 1.15 : 1

    // 性能得分
    const perfScore =
      ((ssd.maxRead / maxRead) * 0.25 +
        (ssd.maxWrite / maxWrite) * 0.25 +
        (ssd.read4K / maxRead4K) * 0.3 +
        (ssd.write4K / maxWrite4K) * 0.2) *
      dynamicWeights.performance *
      recommendedBonus

    return {
      ...ssd,
      baseScore: priceScore + perfScore,
    }
  })

  // 6. 计算额外加分项
  const fullyScored = baseScored.map((ssd) => {
    // 品牌加成
    const brandBonus =
      (SSD_BRAND_BONUS[ssd.brand] || SSD_BRAND_BONUS._default) *
      dynamicWeights.brand

    // QLC惩罚
    const qlcPenalty = ssd.flashType === 'QLC' ? 0.75 : 1

    // 额外总分
    const extraScore = brandBonus * qlcPenalty

    return {
      ...ssd,
      totalScore: ssd.baseScore + extraScore,
      extraScore,
    }
  })

  // 7. 排序并返回最佳SSD
  return fullyScored.sort((a, b) => b.totalScore - a.totalScore)[0]
}
