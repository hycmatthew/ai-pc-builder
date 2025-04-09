import { MappedSSDType } from '../constant/mappedObjectTypes';

export const selectBestSSD = (
  ssds: MappedSSDType[],
  suggestedSSD: string[]
): MappedSSDType | null => {
  if (ssds.length === 0) return null;

  // 优先处理推荐列表中有有效价格的SSD
  console.log(suggestedSSD)
  const validSuggested = ssds.filter(ssd => 
    suggestedSSD.includes(ssd.name) && ssd.price > 0
  );
  
  if (validSuggested.length > 0) {
    return [...validSuggested].sort((a, b) => a.price - b.price)[0];
  }

  // 非推荐列表选择逻辑
  const candidates = ssds.filter(ssd => ssd.price > 0);
  if (candidates.length === 0) return null;

  // 计算归一化参数
  const scores = candidates.map(ssd => ssd.score);
  const prices = candidates.map(ssd => ssd.price);
  
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // 计算综合性价比指标
  const scoredSSDs = candidates.map(ssd => {
    const scoreRange = maxScore - minScore;
    const priceRange = maxPrice - minPrice;
    
    // 归一化处理（0-1范围）
    const normScore = scoreRange !== 0 ? (ssd.score - minScore) / scoreRange : 0.5;
    const normPrice = priceRange !== 0 ? (maxPrice - ssd.price) / priceRange : 0.5;
    
    // 平衡权重（可根据需求调整）
    const combined = normScore * 0.6 + normPrice * 0.4;

    return {
      ...ssd,
      combined
    };
  });

  // 多条件排序
  const sorted = scoredSSDs.sort((a, b) => {
    // 先按综合指标
    if (b.combined !== a.combined) return b.combined - a.combined;
    // 次按原始分数
    if (b.score !== a.score) return b.score - a.score;
    // 最后按价格
    return a.price - b.price;
  });

  return sorted[0];
};