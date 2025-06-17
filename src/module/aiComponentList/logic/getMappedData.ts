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

  // 3. 每組保留性價比最高的5個
  const result: MappedGPUType[] = []

  chipsetMap.forEach((group) => {
    // 按性價比降序排序
    group.sort((a, b) => b.valueRatio - a.valueRatio)

    // 取前5名（或更少）
    const topGPUs = group.slice(0, 5)

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
  const mappedMotherboards = mbList
    .filter((item) => {
      if (mbList.length === 1) return true

      // 兼容性過濾條件
      const compatibilityChecks = [
        // CPU插槽匹配
        !cpuSocket || item.socket === cpuSocket,
        // 內存速度支持
        !ramSpeed || item.ram_support?.includes(ramSpeed),
        // 內存插槽數量
        !ramSlots || item.ram_slot >= ramSlots,
        // 內存類型匹配
        !ramType || item.ram_type === ramType,
        // 機箱兼容性
        !caseCompatibility || caseCompatibility.includes(item.form_factor),
      ]

      // 所有條件必須同時滿足
      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        socket: item.socket,
        chipset: item.chipset,
        ramSlot: item.ram_slot,
        ramType: item.ram_type,
        ramSupport: item.ram_support,
        ramMax: item.ram_max,
        formFactor: item.form_factor,
        price: getLocalizedPriceNum(item),
      }
    })
  return mappedMotherboards
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

    // 兼容性检查
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

  // 2. 创建分组映射：capacity -> type (DDR4/DDR5) -> RAM列表
  const capacityMap = new Map<number, Map<string, RAMType[]>>()

  filteredRAMs.forEach((item) => {
    const capacity = item.capacity
    const ramType = item.type // 'DDR4' 或 'DDR5'

    if (!capacityMap.has(capacity)) {
      capacityMap.set(capacity, new Map<string, RAMType[]>())
    }

    const typeMap = capacityMap.get(capacity)!
    if (!typeMap.has(ramType)) {
      typeMap.set(ramType, [])
    }

    typeMap.get(ramType)!.push(item)
  })

  // 3. 处理每个分组，保留性价比前50%
  const result: MappedRAMType[] = []

  capacityMap.forEach((typeMap) => {
    typeMap.forEach((rams) => {
      // 计算性价比并排序
      const ramsWithValue = rams.map((item) => {
        const price = getLocalizedPriceNum(item)
        const score = ramPerformanceLogic(item)
        const valueRatio = price > 0 ? score / price : 0 // 避免除零错误

        return { ...item, valueRatio, price, score }
      })

      // 按性价比降序排序
      ramsWithValue.sort((a, b) => b.valueRatio - a.valueRatio)

      // 计算需要保留的数量（前50%，至少1个）
      const keepCount = Math.max(1, Math.ceil(ramsWithValue.length * 0.5))
      const topRams = ramsWithValue.slice(0, keepCount)

      // 转换为最终格式
      topRams.forEach((item) => {
        result.push({
          id: item.id,
          brand: item.brand,
          capacity: item.capacity,
          type: item.type,
          speed: item.speed,
          latency: item.latency,
          channel: item.channel,
          profile_xmp: item.profile_xmp,
          profile_expo: item.profile_expo,
          hasHeatsink: item.heat_spreader,
          score: item.score,
          price: item.price,
        })
      })
    })
  })
  console.log('Mapped RAMs:', result)
  return result
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
  return coolerList
    .filter((item) => {
      // 保留唯一選項
      if (coolerList.length === 1) return true

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
      score *= 0.92
    }

    if (Conditions.isGamingBuildWithAMD3D(item, buildType)) {
      console.log('AMD 3D V-Cache 加成:', item.id)
      // AMD 3D V-Cache 加成
      score *= 1.15
    }

    return score
  },

  gpu: (item: GPUType, buildType: BuildType) => {
    let score = item.benchmark * BuildConfig.GPUFactor.GPUScoreMultiply

    if (Conditions.isNvidiaGPU(item)) {
      // 基礎加成
      let multiplier = 1.05

      // 專業應用加成
      if (buildType === BuildType.AI) {
        multiplier = 1.5
      }

      // RTX 50系列額外加成
      if (Conditions.isRTX50Series(item)) {
        multiplier = 1.1
      }

      score *= multiplier
    }

    return score
  },
} as const
