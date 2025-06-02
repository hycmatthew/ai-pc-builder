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
import BuildConfig from '../constant/buildConfig'
import { estimateDefaultPrice, getPricingFactor } from './pricingLogic'
import { findBestConfiguration } from './selectAlgorithm'
import { selectBestCase } from './selectCase'
import { selectBestCooler } from './selectCooler'
import { selectBestPSU } from './selectPSULogic'
import { selectBestSSD } from './selectSSD'
import {
  getMappedCases,
  getMappedCoolers,
  getMappedCPUs,
  getMappedGPUs,
  getMappedMotherboards,
  getMappedPSUs,
  getMappedRAMs,
  getMappedSSDs,
} from './getMappedData'
import {
  MappedCPUType,
  MappedGPUType,
  MappedMotherboardType,
  MappedRAMType,
  MappedSSDType,
  MappedCaseType,
  MappedPSUType,
  MappedCoolerType,
} from '../constant/mappedObjectTypes'
import { BuildType } from '../constant/buildType'

const weights = {
  gaming: { cpu: 0.3, gpu: 0.6, ram: 0.1 }, // 游戏更依赖 GPU
  balance: { cpu: 0.5, gpu: 0.3, ram: 0.2 }, // 办公更依赖 CPU
  rendering: { cpu: 0.4, gpu: 0.4, ram: 0.2 }, // 渲染依赖 CPU 和 GPU
  ai: { cpu: 0.2, gpu: 0.7, ram: 0.1 },
}

interface CompatibilityFilters {
  // CPU相关
  cpuBrand?: string // CPU品牌（Intel, AMD）
  cpuSocket?: string // CPU插槽类型（如LGA1700, AM5）

  // 主板相关
  mbFormFactor?: string // 主板尺寸（ATX, Micro-ATX, Mini-ITX）
  mbSocket?: string
  mbRamType?: string // 内存类型（DDR4, DDR5）
  // pcieVersion?: number // PCIe版本（4.0, 5.0）

  // 显卡相关
  gpuLength?: number // 最大显卡长度（毫米）
  // gpuPowerConnector?: string;  // 显卡电源接口（如8-pin, 12VHPWR）

  // 内存相关
  ramType?: string // 内存类型（DDR4, DDR5）
  ramSpeed?: number // 内存基础频率（MHz）
  ramSlots?: number // 主板内存插槽数量

  // 存储相关
  // sataPorts?: number;          // SATA接口数量
  // m2Slots?: number;            // M.2插槽数量

  // 机箱相关
  caseCompatibility?: string[] // 支持的机箱类型
  maxCoolerHeight?: number // 最大散热器高度
  radiatorSupport?: number // 水冷支持
  maxGPULength?: number // 最大显卡长度（毫米）

  // 电源相关
  psuSize?: string // 电源尺寸（ATX, SFX）

  // 散热器相关
  coolerSocket?: string[] // 支持的CPU插槽类型
  coolerIsLiquid?: string // 散热器类型（风冷/水冷）
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
  storage: number,
  type: BuildType
) => {
  // 1. 识别用户已选组件并计算已用预算
  const selectedComponents = {
    cpu: cpuList.length === 1 ? cpuList[0] : undefined,
    gpu: gpuList.length === 1 ? gpuList[0] : undefined,
    motherboard: mbList.length === 1 ? mbList[0] : undefined,
    ram: ramList.length === 1 ? ramList[0] : undefined,
    ssd: ssdList.length === 1 ? ssdList[0] : undefined,
    pcCase: caseList.length === 1 ? caseList[0] : undefined,
    psu: psuList.length === 1 ? psuList[0] : undefined,
    cooler: coolerList.length === 1 ? coolerList[0] : undefined,
  }

  // 计算需要预留的默认组件预算
  const usedBudget = estimateDefaultPrice(
    caseList,
    psuList,
    coolerList
  )
  let availableBudget = budget - usedBudget * 0.9
  console.log('availableBudget : ', availableBudget)

  if (availableBudget < 0) return null

  // 2. 建立兼容性过滤器
  const filters: CompatibilityFilters = {
    // CPU相关
    cpuBrand: selectedComponents.cpu?.brand,
    cpuSocket: selectedComponents.cpu?.socket,
    // 主板相关
    mbSocket: selectedComponents.motherboard?.socket,
    mbFormFactor: selectedComponents.motherboard?.form_factor,
    mbRamType: selectedComponents.motherboard?.ram_type,
    // 显卡相关
    gpuLength: selectedComponents.gpu?.length,
    // 内存相关
    ramSpeed: selectedComponents.ram?.speed,
    ramSlots: selectedComponents.ram?.channel,
    ramType: selectedComponents.ram?.type,
    // 机箱相关
    caseCompatibility: selectedComponents.pcCase?.compatibility,
    maxGPULength: selectedComponents.pcCase?.max_vga_length,
    maxCoolerHeight: selectedComponents.pcCase?.max_cpu_cooler_height,
    radiatorSupport: selectedComponents.pcCase?.radiator_support,
    psuSize: selectedComponents.psu?.size,
  }

  const selectedWeights = weights[type]
  const cpuBudget =
    budget * getPricingFactor(budget, BuildConfig.CPUFactor.CPUBudgetFactor)
  const gpuBudget =
    budget * getPricingFactor(budget, BuildConfig.GPUFactor.GPUBudgetFactor)
  const ssdBudget =
    budget * getPricingFactor(budget, BuildConfig.SSDFactor.SSDBudgetFactor)

  const mappedCPUs = getMappedCPUs(cpuList, cpuBudget, filters.mbSocket, type)
  const mappedGPUs = getMappedGPUs(
    gpuList,
    gpuBudget,
    filters.maxGPULength,
    type
  )
  const mappedMotherboards = getMappedMotherboards(
    mbList,
    cpuBudget,
    filters.cpuSocket,
    filters.ramSpeed,
    filters.ramSlots,
    filters.ramType,
    filters.caseCompatibility
  )
  const mappedRAMs = getMappedRAMs(
    ramList,
    ssdBudget,
    filters.cpuBrand,
    filters.mbRamType
  )
  const mappedSSDs = getMappedSSDs(ssdList, ssdBudget, storage)
  const mappedPSUs = getMappedPSUs(psuList, availableBudget)
  const mappedCases = getMappedCases(
    caseList,
    filters.mbFormFactor,
    filters.gpuLength,
    availableBudget
  )
  const mappedCoolers = getMappedCoolers(
    coolerList,
    filters.maxCoolerHeight,
    filters.radiatorSupport,
    availableBudget
  )

  /** Start the config logic */
  let bestSSD = null
  let bestPsu = null
  let bestCase = null
  let bestCooler = null
  bestSSD = selectBestSSD(mappedSSDs, BuildConfig.SSDFactor.SSDSuggestion)
  availableBudget -= bestSSD ? bestSSD.price : 0

  const bestConfig = findBestConfiguration(
    mappedCPUs,
    mappedGPUs,
    mappedMotherboards,
    mappedRAMs,
    availableBudget,
    selectedWeights
  )

  if (bestConfig) {
    const totalPower =
      bestConfig.cpu.power + (bestConfig.gpu ? bestConfig.gpu.power : 0) + 80
    const isNvidiaGPU = bestConfig.gpu?.manufacturer === 'NVIDIA'
    bestPsu = selectBestPSU(mappedPSUs, totalPower, 200, isNvidiaGPU)
    bestCase = selectBestCase(
      bestConfig.motherboard,
      bestConfig.gpu,
      null,
      mappedCases
    )
    if (bestCase) {
      bestCooler = selectBestCooler(bestConfig.cpu, bestCase, mappedCoolers)
    }
  }

  const calRes = calculateTotal({
    cpu: bestConfig?.cpu,
    gpu: bestConfig?.gpu,
    motherboard: bestConfig?.motherboard,
    ram: bestConfig?.ram,
    ssd: bestSSD,
    psu: bestPsu,
    pcCase: bestCase,
    cooler: bestCooler,
  })

  console.log({
    cpu: bestConfig?.cpu,
    gpu: bestConfig?.gpu,
    motherboard: bestConfig?.motherboard,
    ram: bestConfig?.ram,
    ssd: bestSSD,
    psu: bestPsu,
    case: bestCase,
    cooler: bestCooler,
    totalPrice: calRes.price,
    totalScore: calRes.score,
  })

  return {
    cpu: bestConfig?.cpu,
    gpu: bestConfig?.gpu,
    motherboard: bestConfig?.motherboard,
    ram: bestConfig?.ram,
    ssd: bestSSD,
    psu: bestPsu,
    case: bestCase,
    cooler: bestCooler,
    totalPrice: calRes.price,
    totalScore: calRes.score,
  }
}

interface CalculationResult {
  price: number
  score: number
}

type HardwareComponents = {
  cpu?: MappedCPUType
  gpu?: MappedGPUType | null
  motherboard?: MappedMotherboardType // 假设这些类型都有 price 属性
  ram?: MappedRAMType
  ssd?: MappedSSDType | null
  pcCase?: MappedCaseType | null
  psu?: MappedPSUType | null
  cooler?: MappedCoolerType | null
}

function calculateTotal(components: HardwareComponents): CalculationResult {
  // 计算总价格
  const totalPrice = Object.values(components)
    .filter(Boolean)
    .reduce((sum, component) => sum + (component?.price || 0), 0)

  // 计算总分数
  let totalScore = 0

  // CPU 基础分数
  if (components.cpu) {
    totalScore += components.cpu.score || 0
  }

  // 图形分数处理
  if (components.gpu) {
    totalScore += components.gpu.score || 0
  } else if (components.cpu) {
    totalScore += components.cpu.integratedGraphicsScore || 0
  }

  return {
    price: totalPrice,
    score: totalScore,
  }
}
