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
  const mappedGPUs = gpuList
    .filter((item) => {
      if (gpuList.length === 1) {
        return true
      }
      const isMaxGPULengthValid = maxGPULength
        ? item.length < maxGPULength
        : true

      return priceValidation(item, budget) && isMaxGPULengthValid
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        manufacturer: item.manufacturer,
        score: ScoreAdjusters.gpu(item, type),
        power: item.power,
        length: item.length,
        price: getLocalizedPriceNum(item),
      }
    })
  return mappedGPUs
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
  return ramList
    .filter((item) => {
      // 保留唯一選項
      if (ramList.length === 1) return true

      // 兼容性過濾條件
      const compatibilityChecks = [
        // 主板記憶體類型匹配 (DDR4/DDR5)
        !mbRamType || item.type === mbRamType,
        // CPU 品牌兼容性檢查
        !cpuBrand ||
          (cpuBrand.toLowerCase() === 'intel'
            ? item.profile_xmp
            : cpuBrand.toLowerCase() === 'amd'
              ? item.profile_expo
              : true), // 未知品牌CPU不檢查兼容性
      ]

      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        id: item.id,
        brand: item.brand,
        capacity: item.capacity,
        type: item.type,
        speed: item.speed,
        channel: item.channel,
        profile_expo: item.profile_expo,
        profile_xmp: item.profile_xmp,
        score: ramPerformanceLogic(item),
        price: getLocalizedPriceNum(item),
      }
    })
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
      // AMD 3D V-Cache 加成
      score *= 1.08
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
