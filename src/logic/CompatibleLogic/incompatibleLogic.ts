import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  CaseType,
  CoolerType,
  FanType,
} from '../../constant/objectTypes'

// Motherboard CPU
export const cpuIncompatibleWithMotherboard = (
  cpu: CPUType | null,
  motherboard: MotherboardType | null
) => {
  return cpu && motherboard ? motherboard.Socket !== cpu.Socket : false
}

// Motherboard CPU
export const motherboardIncompatibleWithRam = (
  motherboard: MotherboardType | null,
  ram: RAMType
) => {
  let result = false
  if (ram && motherboard) {
    result =
      !motherboard.RamSupport.includes(ram.Speed) ||
      !motherboard.RamType.includes(ram.Type)
  }
  return result
}

// Motherboard Case
export const motherboardIncompatibleWithCase = (
  pcCase: CaseType,
  motherboard: MotherboardType | null
) => {
  return motherboard && pcCase.Compatibility
    ? !pcCase.Compatibility.includes(motherboard.FormFactor)
    : false
}

// GPU Case
export const gpuIncompatibleWithCase = (
  pcCase: CaseType | null,
  gpu: GPUType | null
) => {
  return gpu && pcCase ? gpu.Length > pcCase.MaxVGAlength : false
}

export const caseIncompatibleWithAIO = (
  pcCase: CaseType,
  aio: CoolerType | null
) => {
  /*
  const listOfAIOSize: number[] = [120, 140, 240, 280, 360, 420]
  let radiatorSupportList: number[] = []
  for (const item of listOfAIOSize) {
    if (pcCase.RadiatorSupport >= item) {
      radiatorSupportList.push(item)
    }
  }
  */
  return aio && pcCase ? aio.LiquidCoolerSize > pcCase.RadiatorSupport : false
}

export const airCoolerIncompatibleWithCase = (
  airCooler: FanType,
  pcCase: CaseType | null
) => {
  return airCooler && pcCase
    ? airCooler.maxCoolerHeight > pcCase.MaxCpuCoolorHeight
    : false
}

export const psuPowerNotEnough = (psuPower: number, totalPower: number) => {
  return totalPower > psuPower
}