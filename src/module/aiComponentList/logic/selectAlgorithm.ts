import {
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedRAMType,
} from '../constant/mappedObjectTypes'
import {
  CHIPSET_POWER_RANK,
  CHIPSET_RULES,
  BRAND_POWER_SCORE,
  FORM_FACTOR_PENALTY,
  RAM_BRAND_FACTOR,
} from '../constant/buildType'

type BestConfiguration = {
  cpu: MappedCPUType
  motherboard: MappedMotherboardType
  ram: MappedRAMType
  gpu: MappedGPUType | null
}

// 改进1: 使用四分位数计算参考值
function calculateReferenceValues(
  cpus: MappedCPUType[],
  gpus: MappedGPUType[],
  rams: MappedRAMType[]
) {
  // 过滤无效分数并排序
  const filterAndSort = (arr: number[]) =>
    arr.filter((score) => score > 0).sort((a, b) => a - b)

  const cpuScores = filterAndSort(cpus.map((c) => c.score))
  const gpuScores = filterAndSort(gpus.map((g) => g.score))
  const ramScores = filterAndSort(rams.map((r) => r.score))

  // 计算四分位数
  const getQuartiles = (arr: number[]) => {
    if (arr.length === 0) return { q1: 0, median: 0, q3: 0 }

    // const mid = Math.floor(arr.length / 2)
    const q1 = arr[Math.floor(arr.length * 0.25)]
    const median = arr[Math.floor(arr.length * 0.5)]
    const q3 = arr[Math.floor(arr.length * 0.75)]

    return { q1, median, q3 }
  }

  return {
    cpu: getQuartiles(cpuScores),
    gpu: getQuartiles(gpuScores),
    ram: getQuartiles(ramScores),
  }
}

// 改进2: 使用标准分数(Z-Score)进行标准化
function calculateZScore(
  score: number,
  median: number,
  iqr: number // 四分位距
): number {
  if (iqr === 0) return 0 // 避免除以零

  // 计算基于四分位数的标准化分数
  const z = (score - median) / (iqr * 1.5)

  // 使用sigmoid函数将分数压缩到0-1范围
  return 1 / (1 + Math.exp(-z))
}

// 改进性能评分计算
function calculatePerformanceScore(
  cpuScore: number,
  gpuScore: number,
  ramScore: number,
  mbScore: number, // 新增主板评分
  weights: { cpu: number; gpu: number; ram: number },
  reference: {
    cpu: { q1: number; median: number; q3: number }
    gpu: { q1: number; median: number; q3: number }
    ram: { q1: number; median: number; q3: number }
  }
): number {
  // 1. 计算四分位距(IQR)
  const cpuIQR = reference.cpu.q3 - reference.cpu.q1
  const gpuIQR = reference.gpu.q3 - reference.gpu.q1
  const ramIQR = reference.ram.q3 - reference.ram.q1

  // 2. 计算标准分数
  const zCpu = calculateZScore(cpuScore, reference.cpu.median, cpuIQR)
  const zGpu = calculateZScore(gpuScore, reference.gpu.median, gpuIQR)
  const zRam = calculateZScore(ramScore, reference.ram.median, ramIQR)

  // 3. CPU-GPU瓶颈计算（调和平均数）
  const bottleneckScore = (2 * (zCpu * zGpu)) / (zCpu + zGpu + 1e-10)

  // 4. 主板评分标准化（0-1范围）
  const normalizedMbScore = 1 / (1 + Math.exp(-mbScore * 0.1)) // 使用sigmoid压缩

  // 5. 权重分配（主板占5%）
  const totalWeight = weights.cpu + weights.gpu + weights.ram
  const mbWeight = totalWeight * 0.05 // 主板权重5%
  const adjustedCpuGpuWeight = (weights.cpu + weights.gpu) * 0.95
  const adjustedRamWeight = weights.ram * 0.95

  // 6. 加权几何平均
  const weightedProduct =
    Math.pow(bottleneckScore + 1e-10, adjustedCpuGpuWeight) *
    Math.pow(zRam + 1e-10, adjustedRamWeight) *
    Math.pow(normalizedMbScore + 1e-10, mbWeight)

  return Math.pow(
    weightedProduct,
    1 / (adjustedCpuGpuWeight + adjustedRamWeight + mbWeight)
  )
}

// 优化2: 添加缓存机制避免重复计算
const chipsetDataCache = new Map<
  string,
  {
    rank: number
    powerSupport: number
    class: number
    generation: number
  }
>()

export const findBestConfiguration = (
  cpus: MappedCPUType[],
  gpus: MappedGPUType[],
  motherboards: MappedMotherboardType[],
  rams: MappedRAMType[],
  budget: number,
  weights: { cpu: number; gpu: number; ram: number }
) => {
  const reference = calculateReferenceValues(cpus, gpus, rams)

  // 预处理数据结构
  const ramsByType = groupRamsByType(rams)
  const [sortedGPUs, gpuLookupTable] = preprocessGPUs(gpus)

  // 按性能/价格比排序CPU
  const sortedCPUs = [...cpus].sort(
    (a, b) => b.score / b.price - a.score / a.price
  )

  let bestScore = 0
  let bestConfig: BestConfiguration | null = null

  // 遍历所有可能的CPU
  for (const cpu of sortedCPUs) {
    // 如果CPU价格超过预算50%，跳过
    if (cpu.price > budget * 0.5) continue

    // 获取兼容主板
    const compatibleMBs = motherboards
      .filter((mb) => mb.socket === cpu.socket)
      .filter((mb) => mb.price <= budget * 0.35)

    if (compatibleMBs.length === 0) continue

    const scoredMBs = preprocessMotherboards(compatibleMBs, cpu, budget)
    // 只考虑性价比最高的主板
    const topMBs = scoredMBs.slice(
      0,
      Math.min(5, Math.ceil(scoredMBs.length * 0.2))
    )
    //console.log(scoredMBs)
    //console.log(topMBs)

    for (const mb of topMBs) {
      // 提前终止条件
      if (cpu.price + mb.price > budget * 0.7) continue

      // 获取兼容内存
      const compatibleRams = (ramsByType.get(mb.ramType) || [])
        .filter((ram) => ram.channel <= mb.ramSlot)
        .map((ram) => ({
          ...ram,
          score: calculateRamPerformance(ram, mb.ramSupport),
          valueRatio: ram.score / ram.price, // 添加性价比指标
        }))
        // 按性价比排序内存
        .sort((a, b) => b.valueRatio - a.valueRatio)

      for (const ram of compatibleRams) {
        const baseCost = cpu.price + mb.price + ram.price
        if (baseCost > budget) continue

        // 计算CPU实际性能
        const effectiveCPUScore = cpu.score * (0.9 + 0.1 * mb.score)

        // 情况1: 使用核显
        if (cpu.integratedGraphicsScore > 0) {
          const currentScore = calculatePerformanceScore(
            effectiveCPUScore,
            cpu.integratedGraphicsScore,
            ram.score,
            mb.score,
            weights,
            reference
          )
          if (currentScore > bestScore) {
            bestScore = currentScore
            bestConfig = { cpu, motherboard: mb, ram, gpu: null }
          }
        }

        // 情况2: 使用独立显卡
        const remainingBudget = budget - baseCost
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
              mb.score,
              weights,
              reference
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

// 优化7: 改进GPU查找算法
function findBestGPU(
  sortedGPUs: MappedGPUType[],
  lookupTable: number[],
  budget: number
): MappedGPUType | undefined {
  let low = 0
  let high = sortedGPUs.length - 1
  let bestIndex = -1

  // 二分查找最大可承受价格
  while (low <= high) {
    const mid = (low + high) >> 1 // 更快的位运算
    if (sortedGPUs[mid].price <= budget) {
      bestIndex = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  if (bestIndex === -1) return undefined

  // 查找具有目标分数的第一个GPU
  const targetScore = lookupTable[bestIndex]

  // 反向线性扫描（针对小范围优化）
  const startIndex = Math.max(0, bestIndex - 10)
  for (let i = bestIndex; i >= startIndex; i--) {
    if (sortedGPUs[i].score === targetScore) {
      return sortedGPUs[i]
    }
  }

  return sortedGPUs[bestIndex] // 安全回退
}

/************************* Helper Function *************************/
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
      keywords: ['I3', 'RYZEN 3'],
      minPower: 60,
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

/****************************** Motherboard Logic ******************************/
// 优化3: 重构芯片组数据处理逻辑
function getChipsetData(chipset: string) {
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

// 优化4: 改进主板评分函数
const rateMotherboard = (
  mb: MappedMotherboardType,
  cpu: MappedCPUType,
  budget: number
): number => {
  const chipsetData = getChipsetData(mb.chipset)
  const cpuClass = getCpuClass(cpu)

  // 1. 价格分数（主要因素） - 50%权重
  const maxMBPrice = budget * 0.3
  const minMBPrice = maxMBPrice * 0.1
  const priceScore = Math.max(
    0,
    1 - (mb.price - minMBPrice) / (maxMBPrice - minMBPrice)
  )

  // 2. 芯片组性能分数 - 30%权重
  const chipsetScore = chipsetData.rank

  // 3. 代数奖励 - 10%权重
  const generationBonus = Math.min(0.1, chipsetData.generation / 10000)

  // 4. DDR4惩罚（如果是DDR4则扣分）
  const isDDR4 = mb.ramType.toUpperCase().includes('DDR4')
  const ramTypePenalty = isDDR4 ? 0.95 : 1.0 // DDR4主板扣5%分数

  // 基础分数 = 价格分数(50%) + 芯片组性能(30%) + 代数奖励(10%)
  let baseScore = priceScore * 0.5 + chipsetScore * 0.3 + generationBonus * 0.1

  // 应用DDR4惩罚
  baseScore *= ramTypePenalty

  // 5. 品牌质量系数
  const brand = mb.brand.toUpperCase().trim()
  const brandFactor = BRAND_POWER_SCORE[brand] || BRAND_POWER_SCORE._default

  // 6. CPU-主板等级匹配
  let classMatch = 1.0
  const classDiff = cpuClass - chipsetData.class
  if (classDiff >= 2)
    classMatch = 0.4 // 严重不匹配
  else if (classDiff === 1)
    classMatch = 0.8 // 轻微不匹配
  else if (classDiff <= -1)
    classMatch = 1.1 // 主板优于CPU
  else if (classDiff === 0) classMatch = 1.2 // 完美匹配

  // 7. 供电能力匹配
  let powerMatch = 1.0
  const requiredPower = cpu.power * 1.2 // 20%余量
  const effectivePower = chipsetData.powerSupport * brandFactor

  if (effectivePower < requiredPower * 0.8)
    powerMatch = 0.5 // 严重不足
  else if (effectivePower < requiredPower)
    powerMatch = 0.8 // 基本满足
  else powerMatch = 1.1 // 超额供电奖励

  // 8. 主板尺寸调整
  const formFactor = mb.formFactor.toUpperCase().trim()
  const formFactorPenalty = FORM_FACTOR_PENALTY[formFactor] || 1.0

  // 最终分数 = 基础分数 * 品牌系数 * 等级匹配 * 供电匹配 * 尺寸惩罚
  return baseScore * brandFactor * classMatch * powerMatch * formFactorPenalty
}

const preprocessMotherboards = (
  mbs: MappedMotherboardType[],
  cpu: MappedCPUType,
  budget: number
) => {
  // 使用Map存储相同芯片组的主板
  const chipsetMap = new Map<string, MappedMotherboardType[]>()

  for (const mb of mbs) {
    const list = chipsetMap.get(mb.chipset) || []
    list.push(mb)
    chipsetMap.set(mb.chipset, list)
  }
  console.log('芯片组分组:', chipsetMap)

  // 只处理每个芯片组的顶级主板
  const processedMBs: MappedMotherboardType[] = []

  for (const [_, mbs] of chipsetMap) {
    // 找到每个芯片组中评分最高的主板
    const bestInGroup = mbs.reduce((best, current) =>
      rateMotherboard(current, cpu, budget) > rateMotherboard(best, cpu, budget)
        ? current
        : best
    )
    processedMBs.push(bestInGroup)
  }

  return processedMBs
    .map((mb) => ({
      ...mb,
      score: rateMotherboard(mb, cpu, budget),
    }))
    .sort((a, b) => b.score - a.score)
}

/****************************** Ram Logic ******************************/
function groupRamsByType(rams: MappedRAMType[]) {
  const map = new Map<string, MappedRAMType[]>()
  rams.forEach((ram) => {
    const key = ram.type
    map.set(key, [...(map.get(key) || []), ram])
  })
  return map
}

// RAM评分函数
function calculateRamPerformance(
  ram: MappedRAMType,
  supportedSpeeds: number[]
): number {
  // 1. 计算有效速度（不超过主板支持）
  const maxSupported = Math.max(...supportedSpeeds)
  const effectiveSpeed = Math.min(ram.speed, maxSupported)

  // 2. 容量权重：分段加权
  const getCapacityWeight = (capacity: number) => {
    if (capacity <= 8) return 0.5
    if (capacity <= 16) return 0.8
    if (capacity <= 32) return 1.1
    if (capacity <= 64) return 1.15
    return 0.8
  }

  // 3. 通道数乘数
  const getChannelMultiplier = (channel: number) => {
    return channel >= 2 ? 1.2 : 1.0
  }

  // 4. 计算真实延迟（纳秒）
  const realLatencyNs = (ram.latency / effectiveSpeed) * 2000

  // 5. 延迟惩罚系数（非线性）
  const getLatencyPenalty = (latencyNs: number) => {
    if (latencyNs <= 10) return 0
    if (latencyNs <= 15) return 80
    if (latencyNs <= 20) return 150
    return 220
  }

  // 6. 基础分计算
  const baseScore = effectiveSpeed * getCapacityWeight(ram.capacity)

  // 7. 应用通道数加成
  const channelBoostedScore = baseScore * getChannelMultiplier(ram.channel)

  // 8. 应用延迟惩罚
  let finalScore =
    channelBoostedScore - realLatencyNs * getLatencyPenalty(realLatencyNs)

  // 9. DDR5加成 (15%性能提升)
  if (ram.type.toUpperCase().includes('DDR5')) {
    finalScore *= 1.1
  }

  // 10. 散热片加成 (5%性能提升)
  if (ram.hasHeatsink) {
    finalScore *= 1.1
  }

  // 11. 品牌加成
  const brand = ram.brand.toUpperCase().trim()
  const brandFactor = RAM_BRAND_FACTOR[brand] || RAM_BRAND_FACTOR._default
  finalScore *= brandFactor

  return Math.max(0, finalScore)
}
