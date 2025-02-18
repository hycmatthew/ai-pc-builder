import {
  CoolerType,
  CaseType,
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
import { getPricingFactor } from './pricingLogic'
import { findBestConfiguration } from './selectAlgorithm'
import { selectBestCase } from './selectCase'
import { selectBestPSU } from './selectPSULogic'

const weights = {
  gaming: { cpu: 0.3, gpu: 0.6, ram: 0.1 }, // 游戏更依赖 GPU
  office: { cpu: 0.6, gpu: 0.2, ram: 0.2 }, // 办公更依赖 CPU
  rendering: { cpu: 0.5, gpu: 0.4, ram: 0.1 }, // 渲染依赖 CPU 和 GPU
}

export const preFilterDataLogic = (
  cpuList: CPUType[],
  mbList: MotherboardType[],
  gpuList: GPUType[],
  ramList: RAMType[],
  ssdList: SSDType[],
  caseList: CaseType[],
  psuList: PSUType[],
  coolerList: CoolerType[],
  budget: number,
  type: string
) => {
  const selectedWeights = weights['gaming']
  const cpuBudget =
    budget * getPricingFactor(budget, BuildConfig.CPUFactor.CPUBudgetFactor)
  const gpuBudget =
    budget * getPricingFactor(budget, BuildConfig.GPUFactor.GPUBudgetFactor)

  const mappedCPUs: MappedCPUType[] = cpuList
    .filter((item) => {
      const price = getCurrentPriceNum(item)
      return price < cpuBudget && price != 0
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

  const mappedGPUs: MappedGPUType[] = gpuList
    .filter((item) => {
      const price = getCurrentPriceNum(item)
      return price < gpuBudget && price != 0
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

  const mappedMotherboards: MappedMotherboardType[] = mbList
    .filter((item) => {
      const price = getCurrentPriceNum(item)
      return price < cpuBudget && price != 0
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

  const mappedRAMs: MappedRAMType[] = ramList
    .filter((item) => {
      const price = getCurrentPriceNum(item)
      return price < cpuBudget && price != 0
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

  const mappedSSDs: MappedSSDType[] = ssdList.map((item) => {
    return {
      name: item.Name,
      brand: item.Brand,
      capacity: item.Capacity,
      formFactor: item.FormFactor,
      score: ssdPerformanceLogic(item),
      price: getCurrentPriceNum(item),
    }
  })

  const mappedCases: MappedCaseType[] = caseList.map((item) => {
    return {
      id: item.Name,
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

  const mappedCoolers: MappedCoolerType[] = coolerList.map((item) => {
    return {
      id: item.Name,
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

  const bestConfig = findBestConfiguration(
    mappedCPUs,
    mappedGPUs,
    mappedMotherboards,
    mappedRAMs,
    budget,
    selectedWeights
  )
  console.log(mappedRAMs)
  console.log(bestConfig)
  if (bestConfig) {
    const totalPrice =
      bestConfig.cpu.price +
      bestConfig.motherboard.price +
      bestConfig.ram.price +
      (bestConfig.gpu ? bestConfig.gpu.price : 0)
    const totalScore =
      bestConfig.cpu.score +
      bestConfig.ram.score +
      (bestConfig.gpu
        ? bestConfig.gpu.score
        : bestConfig.cpu.integratedGraphicsScore)

    console.log('总价格:', totalPrice)
    console.log('总性能分数:', totalScore)

    const mappedPSUs: MappedPSUType[] = psuList.map((item) => {
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

    const totalPower =
      bestConfig.cpu.power + (bestConfig.gpu ? bestConfig.gpu.power : 0)
    const bestPsu = selectBestPSU(mappedPSUs, totalPower, 200)
    const bestCase = selectBestCase(bestConfig.motherboard, bestConfig.gpu, null, mappedCases)
  }
}
