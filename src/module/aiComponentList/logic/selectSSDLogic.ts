import { MappedSSDType } from '../constant/mappedObjectTypes'

interface Weights {
  recommended: number
  price: number
  performance: number
  flashTypeQLC: number
  brand: number
}

const BRAND_BONUS: Record<string, number> = {
  samsung: 3,
  westerndigital: 2,
  kingston: 1,
  crucial: 1,
}

export const selectBestSSD = (
  ssds: MappedSSDType[],
  suggestedSSDs: string[],
  weights: Weights = {
    recommended: 0.3,
    price: 0.25,
    performance: 0.3,
    flashTypeQLC: -0.1,
    brand: 0.15,
  }
): MappedSSDType | null => {
  // 1. 過濾符合容量要求的 SSD

  if (ssds.length === 0) return null

  // 2. 計算各項指標範圍
  const prices = ssds.map((ssd) => ssd.price)
  const maxReads = ssds.map((ssd) => ssd.maxRead)
  const maxWrites = ssds.map((ssd) => ssd.maxWrite)
  const read4Ks = ssds.map((ssd) => ssd.read4K)
  const write4Ks = ssds.map((ssd) => ssd.write4K)

  const [minPrice, maxPrice] = [Math.min(...prices), Math.max(...prices)]
  const maxMaxRead = Math.max(...maxReads)
  const maxMaxWrite = Math.max(...maxWrites)
  const maxRead4K = Math.max(...read4Ks)
  const maxWrite4K = Math.max(...write4Ks)

  // 3. 計算總分
  const scoredSSDs = ssds.map((ssd) => {
    // 推薦列表加分
    const recommendedScore = suggestedSSDs.includes(ssd.id)
      ? weights.recommended
      : 0

    // 價格分數（反向計算，價格越低分數越高）
    const priceScore =
      ((maxPrice - ssd.price) / (maxPrice - minPrice)) * weights.price

    // 性能分數
    const performanceScore =
      ((ssd.maxRead / maxMaxRead) * 0.25 +
        (ssd.maxWrite / maxMaxWrite) * 0.25 +
        (ssd.read4K / maxRead4K) * 0.6 +
        (ssd.write4K / maxWrite4K) * 0.3) *
      weights.performance

    // console.log(`SSD: ${ssd.name},${ssd.price} Price Score: ${priceScore}, Performance Score: ${performanceScore}`)

    // QLC 減分（需要自行添加QLC判斷邏輯到您的數據中）
    const qlcPenalty = ssd.flashType === 'QLC' ? weights.flashTypeQLC : 0

    // 品牌加分
    const brandBonus = BRAND_BONUS[ssd.brand]
      ? BRAND_BONUS[ssd.brand] * weights.brand
      : 0

    const totalScore =
      recommendedScore + priceScore + performanceScore + qlcPenalty + brandBonus

    return { ...ssd, calculatedScore: totalScore }
  })

  // 4. 排序並返回最佳
  scoredSSDs.sort((a, b) => b.calculatedScore - a.calculatedScore)
  // console.log(scoredSSDs)
  return scoredSSDs[0]
}
