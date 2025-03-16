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
import { getCurrentPriceNum } from '../../../utils/NumberHelper'
import BuildConfig from '../constant/buildConfig'
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
  const price = getCurrentPriceNum(item)
  return price < budget && price !== 0
}

export function getMappedCPUs(
  cpuList: CPUType[],
  budget: number,
  mbSocket: string | undefined
): MappedCPUType[] {
  const mappedCPUs: MappedCPUType[] = cpuList
    .filter((item) => {
      if (cpuList.length === 1) {
        return true
      }
      const isSocketValid = mbSocket ? item.Socket == mbSocket : true
      return priceValidation(item, budget) && isSocketValid
    })
    .map((item) => {
      return {
        name: item.Name,
        brand: item.Brand,
        socket: item.Socket,
        gpu: item.GPU,
        score:
          item.SingleCoreScore * BuildConfig.CPUFactor.SingleCoreMultiply +
          item.MultiCoreScore * BuildConfig.CPUFactor.MultiCoreMultiply,
        integratedGraphicsScore:
          item.IntegratedGraphicsScore * BuildConfig.GPUFactor.GPUScoreMultiply,
        power: item.Power,
        price: getCurrentPriceNum(item),
      }
    })
  return mappedCPUs
}

export function getMappedGPUs(
  gpuList: GPUType[],
  budget: number,
  maxGPULength: number | undefined
): MappedGPUType[] {
  const mappedGPUs = gpuList
    .filter((item) => {
      if (gpuList.length === 1) {
        return true
      }
      const isMaxGPULengthValid = maxGPULength
        ? item.Length < maxGPULength
        : true

      return priceValidation(item, budget) && isMaxGPULengthValid
    })
    .map((item) => {
      return {
        name: item.Name,
        brand: item.Brand,
        score: item.Benchmark * BuildConfig.GPUFactor.GPUScoreMultiply,
        power: item.Power,
        length: item.Length,
        price: getCurrentPriceNum(item),
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
        !cpuSocket || item.Socket === cpuSocket,
        // 內存速度支持
        !ramSpeed || item.RamSupport?.includes(ramSpeed),
        // 內存插槽數量
        !ramSlots || item.RamSlot >= ramSlots,
        // 內存類型匹配
        !ramType || item.RamType === ramType,
        // 機箱兼容性
        !caseCompatibility || caseCompatibility.includes(item.FormFactor),
      ]

      // 所有條件必須同時滿足
      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        name: item.Name,
        brand: item.Brand,
        socket: item.Socket,
        chipset: item.Chipset,
        ramSlot: item.RamSlot,
        ramType: item.RamType,
        ramSupport: item.RamSupport,
        ramMax: item.RamMax,
        formFactor: item.FormFactor,
        price: getCurrentPriceNum(item),
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
        !mbRamType || item.Type === mbRamType,
        // CPU 品牌兼容性檢查
        !cpuBrand || item.Profile?.includes(cpuBrand),
      ]

      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        name: item.Name,
        brand: item.Brand,
        capacity: item.Capacity,
        type: item.Type,
        channel: item.Channel,
        profile: item.Profile,
        score: ramPerformanceLogic(item),
        price: getCurrentPriceNum(item),
      }
    })
}

export function getMappedSSDs(
  ssdList: SSDType[],
  budget: number
): MappedSSDType[] {
  return ssdList
    .filter((item) => {
      if (ssdList.length === 1) {
        return true
      }
      return (
        priceValidation(item, budget) &&
        (item.Capacity == '1000 GB' || item.Capacity == '1TB')
      )
    })
    .map((item) => {
      return {
        name: item.Name,
        brand: item.Brand,
        capacity: item.Capacity,
        formFactor: item.FormFactor,
        score: ssdPerformanceLogic(item),
        price: getCurrentPriceNum(item),
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
        brand: item.Brand,
        name: item.Name,
        wattage: item.Wattage,
        size: item.Size,
        standard: item.Standard,
        modular: item.Modular,
        efficiency: item.Efficiency,
        length: item.Length,
        price: getCurrentPriceNum(item),
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
        !mbFormFactor || item.Compatibility?.includes(mbFormFactor),
        // 顯卡長度兼容性檢查
        !gpuLength || item.MaxVGAlength >= gpuLength,
      ]

      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        id: item.Id,
        brand: item.Brand,
        name: item.Name,
        caseSize: item.CaseSize,
        powerSupply: item.PowerSupply,
        compatibility: item.Compatibility,
        maxVGAlength: item.MaxVGAlength,
        radiatorSupport: item.RadiatorSupport,
        maxCpuCoolorHeight: item.MaxCpuCoolorHeight,
        price: getCurrentPriceNum(item),
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
        !item.IsLiquidCooler && maxCoolerHeight
          ? maxCoolerHeight >= item.AirCoolerHeight
          : true,

        // 水冷排兼容性檢查
        item.IsLiquidCooler && radiatorSupport
          ? radiatorSupport >= item.LiquidCoolerSize
          : true,
      ]

      return priceValidation(item, budget) && compatibilityChecks.every(Boolean)
    })
    .map((item) => {
      return {
        id: item.Id,
        brand: item.Brand,
        name: item.Name,
        sockets: item.Sockets,
        isLiquidCooler: item.IsLiquidCooler,
        liquidCoolerSize: item.LiquidCoolerSize,
        airCoolerHeight: item.AirCoolerHeight,
        noiseLevel: item.NoiseLevel,
        price: getCurrentPriceNum(item),
      }
    })
}
