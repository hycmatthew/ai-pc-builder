import {
  CaseType,
  CoolerType,
  CPUType,
  GPUType,
  MotherboardType,
  PSUType,
  RAMType,
  SSDType,
} from '../../../constant/objectTypes'
import {
  ramPerformanceLogic,
  ssdPerformanceLogic,
} from '../../../logic/performanceLogic'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'
import BuildConfig from '../constant/buildConfig'
import { BuildType } from '../constant/buildType'
import {
  MappedCaseType,
  MappedCoolerType,
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedPSUType,
  MappedRAMType,
  MappedSSDType,
} from '../constant/mappedObjectTypes'
import { calculateMotherboardBaseScore } from './scoreLogic'

const priceValidation = (item: any, budget: number): boolean => {
  const price = getLocalizedPriceNum(item)
  return price < budget && price !== 0
}

export function getMappedCPUs(
  cpuList: CPUType[],
  budget: number,
  mbSocket: string | undefined,
  type: BuildType
): MappedCPUType[] {
  const mappedCPUs: MappedCPUType[] = cpuList
    .filter((item) => {
      if (cpuList.length === 1) {
        return true
      }
      const isSocketValid = mbSocket ? item.socket == mbSocket : true
      return priceValidation(item, budget) && isSocketValid
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        socket: item.socket,
        gpu: item.gpu,
        score: ScoreAdjusters.cpu(item, type),
        integratedGraphicsScore:
          item.integrated_graphics_score *
          BuildConfig.GPUFactor.GPUScoreMultiply,
        power: item.power,
        price: getLocalizedPriceNum(item),
      }
    })
  return mappedCPUs
}

export function getMappedGPUs(
  gpuList: GPUType[],
  budget: number,
  maxGPULength: number | undefined,
  type: BuildType
): MappedGPUType[] {
  // 1. 初步過濾：滿足預算和尺寸限制
  const filteredGPUs = gpuList.filter((item) => {
    if (gpuList.length === 1) return true

    const withinBudget = priceValidation(item, budget)
    const fitsCase = maxGPULength ? item.length < maxGPULength : true

    return withinBudget && fitsCase
  })

  // 2. 計算性價比並按chipset分組
  const chipsetMap = new Map<
    string,
    { gpu: GPUType; score: number; price: number; valueRatio: number }[]
  >()

  filteredGPUs.forEach((item) => {
    const price = getLocalizedPriceNum(item)
    // 避免除以0的錯誤
    if (price <= 0) return

    const score = ScoreAdjusters.gpu(item, type)
    const valueRatio = score / price // 性價比 = 性能分數 / 價格

    const chipsetGroup = chipsetMap.get(item.chipset) || []
    chipsetGroup.push({
      gpu: item,
      score,
      price,
      valueRatio,
    })
    chipsetMap.set(item.chipset, chipsetGroup)
  })

  // 3. 每組保留性價比最高的6個
  const result: MappedGPUType[] = []

  chipsetMap.forEach((group) => {
    // 按性價比降序排序
    group.sort((a, b) => b.valueRatio - a.valueRatio)

    // 取前6名（或更少）
    const topGPUs = group.slice(0, 6)

    // 轉換為最終格式
    topGPUs.forEach(({ gpu, score, price }) => {
      result.push({
        id: gpu.id,
        brand: gpu.brand,
        manufacturer: gpu.manufacturer,
        chipset: gpu.chipset,
        score,
        power: gpu.power,
        length: gpu.length,
        price,
      })
    })
  })

  return result
}

export function getMappedMotherboards(
  mbList: MotherboardType[],
  budget: number,
  cpuSocket: string | undefined,
  ramSpeed: number | undefined,
  ramSlots: number | undefined,
  ramType: string | undefined,
  caseCompatibility: string[] | undefined
): MappedMotherboardType[] {
  // Step 1: 初始过滤（兼容性 + 价格）
  const mappedMotherboards = mbList
    .filter((item) => {
      if (mbList.length === 1) return true

      const compatibilityChecks = [
        !cpuSocket || item.socket === cpuSocket,
        !ramSpeed || item.ram_support?.includes(ramSpeed),
        !ramSlots || item.ram_slot >= ramSlots,
        !ramType || item.ram_type === ramType,
        !caseCompatibility || caseCompatibility.includes(item.form_factor),
      ]

      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => ({
      id: item.id,
      brand: item.brand,
      name: item.name,
      socket: item.socket,
      chipset: item.chipset,
      ramSlot: item.ram_slot,
      ramType: item.ram_type,
      ramSupport: item.ram_support,
      ramMax: item.ram_max,
      formFactor: item.form_factor,
      score: calculateMotherboardBaseScore(item), // 计算主板性能分数
      price: getLocalizedPriceNum(item),
    }))

  // Step 2: 按芯片组分組
  const groupedByChipset = mappedMotherboards.reduce(
    (acc, mb) => {
      const key = mb.chipset
      if (!acc[key]) acc[key] = []
      acc[key].push(mb)
      return acc
    },
    {} as Record<string, MappedMotherboardType[]>
  )

  // Step 3: 对每个芯片组进行性价比筛选
  const result: MappedMotherboardType[] = []
  for (const chipset in groupedByChipset) {
    const group = groupedByChipset[chipset]

    // 按价格升序排序
    group.sort((a, b) => a.price - b.price)

    // 保留性价比拐点主板
    let currentMaxScore = -1 // 初始化为-1确保第一个主板被保留
    const filteredGroup: MappedMotherboardType[] = []

    for (const mb of group) {
      if (mb.score > currentMaxScore) {
        filteredGroup.push(mb)
        currentMaxScore = mb.score
      }
    }
    result.push(...filteredGroup)
  }

  return result
}

export function getMappedRAMs(
  ramList: RAMType[],
  budget: number,
  cpuBrand: string | undefined,
  mbRamType: string | undefined
): MappedRAMType[] {
  // 1. 初步过滤：满足预算和兼容性要求
  const filteredRAMs = ramList.filter((item) => {
    if (ramList.length === 1) return true

    const isCompatibleWithMB = !mbRamType || item.type === mbRamType
    const isCompatibleWithCPU =
      !cpuBrand ||
      (cpuBrand.toLowerCase() === 'intel'
        ? item.profile_xmp
        : cpuBrand.toLowerCase() === 'amd'
          ? item.profile_expo
          : true)

    return (
      priceValidation(item, budget) && isCompatibleWithMB && isCompatibleWithCPU
    )
  })

  // 2. 按EXPO支持分组
  const expoRAMs = filteredRAMs.filter((ram) => ram.profile_expo)
  const nonExpoRAMs = filteredRAMs.filter((ram) => !ram.profile_expo)

  // 3. 处理函数：对每个分组应用价格-性能过滤逻辑
  const processGroup = (rams: RAMType[]) => {
    // 按容量和类型建立分组
    const groupMap = new Map<string, RAMType[]>()

    rams.forEach((ram) => {
      const key = `${ram.capacity}_${ram.type}`
      if (!groupMap.has(key)) groupMap.set(key, [])
      groupMap.get(key)!.push(ram)
    })

    const result: MappedRAMType[] = []

    // 处理每个分组
    groupMap.forEach((group) => {
      // 计算性能分数并添加价格
      const ramsWithScore = group.map((ram) => ({
        ...ram,
        score: ramPerformanceLogic(ram),
        price: getLocalizedPriceNum(ram),
      }))

      // 按价格升序排序
      ramsWithScore.sort((a, b) => a.price - b.price)

      const filteredGroup: typeof ramsWithScore = []
      let currentMaxScore = -1

      // 应用"价格提升时性能必须提升"逻辑
      for (const ram of ramsWithScore) {
        if (ram.score > currentMaxScore) {
          filteredGroup.push(ram)
          currentMaxScore = ram.score
        }
      }

      // 转换为最终格式
      filteredGroup.forEach((ram) => {
        result.push({
          id: ram.id,
          brand: ram.brand,
          capacity: ram.capacity,
          type: ram.type,
          speed: ram.speed,
          latency: ram.latency,
          channel: ram.channel,
          profile_xmp: ram.profile_xmp,
          profile_expo: ram.profile_expo,
          hasHeatsink: ram.heat_spreader,
          score: ram.score,
          price: ram.price,
        })
      })
    })

    return result
  }

  // 4. 分别处理EXPO组和非EXPO组
  const expoResult = processGroup(expoRAMs)
  const nonExpoResult = processGroup(nonExpoRAMs)

  // 5. 合并结果并返回
  return [...expoResult, ...nonExpoResult]
}

export function getMappedSSDs(
  ssdList: SSDType[],
  budget: number,
  storage: number
): MappedSSDType[] {
  return ssdList
    .filter((item) => {
      if (ssdList.length === 1) {
        return true
      }
      return priceValidation(item, budget) && item.capacity == storage
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        series: item.series,
        capacity: item.capacity,
        formFactor: item.form_factor,
        flashType: item.flash_type,
        interface: item.interface,
        dram: item.d_ram,
        maxRead: item.max_read,
        maxWrite: item.max_write,
        read4K: item.read_4k,
        write4K: item.write_4k,
        score: ssdPerformanceLogic(item),
        price: getLocalizedPriceNum(item),
      }
    })
}

export function getMappedPSUs(
  psuList: PSUType[],
  budget: number
): MappedPSUType[] {
  return psuList
    .filter((item) => {
      if (psuList.length === 1) {
        return true
      }
      return priceValidation(item, budget)
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        wattage: item.wattage,
        size: item.size,
        standard: item.standard,
        modular: item.modular,
        efficiency: item.efficiency,
        length: item.length,
        price: getLocalizedPriceNum(item),
      }
    })
}

export function getMappedCases(
  caseList: CaseType[],
  mbFormFactor: string | undefined,
  gpuLength: number | undefined,
  budget: number
): MappedCaseType[] {
  return caseList
    .filter((item) => {
      // 保留唯一選項
      if (caseList.length === 1) return true

      // 兼容性過濾條件
      const compatibilityChecks = [
        // 主板尺寸兼容性檢查
        !mbFormFactor || item.compatibility?.includes(mbFormFactor),
        // 顯卡長度兼容性檢查
        !gpuLength || item.max_vga_length >= gpuLength,
      ]

      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        caseSize: item.case_size,
        powerSupply: item.power_supply,
        compatibility: item.compatibility,
        maxVGAlength: item.max_vga_length,
        radiatorSupport: item.radiator_support,
        maxCpuCoolorHeight: item.max_cpu_cooler_height,
        price: getLocalizedPriceNum(item),
      }
    })
}

export function getMappedCoolers(
  coolerList: CoolerType[],
  maxCoolerHeight: number | undefined,
  radiatorSupport: number | undefined,
  budget: number
): MappedCoolerType[] {
  const idLists = [
    ...BuildConfig.CoolerFactor.NormalCoolerSuggestion,
    ...BuildConfig.CoolerFactor.HighendCoolerSuggestion,
  ]

  if (radiatorSupport !== undefined && radiatorSupport < 360) {
    idLists.push(...BuildConfig.CoolerFactor.MATXCoolerSuggestion)
  }

  const combinedIds = [...new Set(idLists.flat())]

  return coolerList
    .filter((item) => {
      // 保留唯一選項
      if (coolerList.length === 1) return true

      if (!combinedIds.includes(item.id)) {
        return false
      }

      // 兼容性過濾條件
      const compatibilityChecks = [
        // 空冷散熱器高度檢查
        !item.is_liquid_cooler && maxCoolerHeight
          ? maxCoolerHeight >= item.air_cooler_height
          : true,

        // 水冷排兼容性檢查
        item.is_liquid_cooler && radiatorSupport
          ? radiatorSupport >= item.liquid_cooler_size
          : true,
      ]

      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        sockets: item.sockets,
        isLiquidCooler: item.is_liquid_cooler,
        liquidCoolerSize: item.liquid_cooler_size,
        airCoolerHeight: item.air_cooler_height,
        noiseLevel: item.noise_level,
        price: getLocalizedPriceNum(item),
      }
    })
}

// 專用條件檢查函數 ▼
const Conditions = {
  isAffectedIntel14thGen: (cpu: CPUType) =>
    /^(Core\s+)?i[79][-\s]*14(700|900)/i.test(cpu.id.trim()),

  isGamingBuildWithAMD3D: (cpu: CPUType, buildType: BuildType) =>
    buildType === BuildType.Gaming && /3D/i.test(cpu.id),

  isOldSocket: (cpu: CPUType) =>
    BuildConfig.CPUFactor.OldSockets.includes(cpu.socket),

  isNvidiaGPU: (gpu: GPUType) => gpu.brand === 'NVIDIA',

  isRTX50Series: (gpu: GPUType) => /RTX\s*50/i.test(gpu.id),
} as const

// 分數調整器 ▼
const ScoreAdjusters = {
  cpu: (item: CPUType, buildType: BuildType) => {
    let score =
      item.single_core_score * BuildConfig.CPUFactor.SingleCoreMultiply +
      item.multi_core_score * BuildConfig.CPUFactor.MultiCoreMultiply

    if (Conditions.isAffectedIntel14thGen(item)) {
      // Intel 14代懲罰
      score *= 0.9
    }

    if (Conditions.isGamingBuildWithAMD3D(item, buildType)) {
      console.log('AMD 3D V-Cache 加成:', item.id)
      // AMD 3D V-Cache 加成
      score *= 1.15
    }

    if (Conditions.isOldSocket(item)) {
      score *= 0.95
    }

    return score
  },

  gpu: (item: GPUType, buildType: BuildType) => {
    let score = item.benchmark * BuildConfig.GPUFactor.GPUScoreMultiply

    const baseVRAM = 12 // 基准显存大小
    const vram = item.memory_size

    if (vram < baseVRAM) {
      // 低于12GB：每少1GB扣分5%
      const penalty = (baseVRAM - vram) * 0.05
      score *= 1 - penalty
    } else if (vram > baseVRAM && vram <= 16) {
      // 12-16GB：每多1GB加分3%
      const bonus = (vram - baseVRAM) * 0.03
      score *= 1 + Math.min(bonus, 0.12)
    }

    if (Conditions.isNvidiaGPU(item)) {
      // 基礎加成
      let multiplier = 1.1

      // 專業應用加成
      if (buildType === BuildType.AI) {
        multiplier = 1.5
      }

      // RTX 50系列額外加成
      if (Conditions.isRTX50Series(item)) {
        multiplier = 1.2
      }

      score *= multiplier
    }

    return score
  },
} as const
