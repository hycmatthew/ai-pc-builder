import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  CaseType,
  CoolerType,
} from '../../constant/objectTypes'

// Motherboard CPU
export const cpuIncompatibleWithMotherboard = (
  cpu: CPUType | null,
  motherboard: MotherboardType | null
) => {
  return cpu && motherboard ? motherboard.Socket !== cpu.Socket : false
}

// Motherboard RAM
export const motherboardIncompatibleWithRam = (
  motherboard: MotherboardType | null,
  ram: RAMType | null
) => {
  return ram && motherboard ? motherboard.RamType != ram.Type : false
}

// Motherboard Case
export const motherboardIncompatibleWithCase = (
  pcCase: CaseType | null,
  motherboard: MotherboardType | null
) => {
  return motherboard && pcCase
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

export const aioIncompatibleWithCase = (
  cooler: CoolerType | null,
  pcCase: CaseType | null
) => {
  return cooler && pcCase && cooler.IsLiquidCooler
    ? cooler.LiquidCoolerSize > pcCase.RadiatorSupport
    : false
}

export const airCoolerIncompatibleWithCase = (
  airCooler: CoolerType | null,
  pcCase: CaseType | null
) => {
  return airCooler && !airCooler.IsLiquidCooler && pcCase
    ? airCooler.AirCoolerHeight > pcCase.MaxCpuCoolorHeight
    : false
}

export const psuPowerNotEnough = (psuPower: number, totalPower: number) => {
  return totalPower > psuPower
}
