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
  return cpu && motherboard ? motherboard.socket !== cpu.socket : false
}

// Motherboard RAM
export const motherboardIncompatibleWithRam = (
  motherboard: MotherboardType | null,
  ram: RAMType | null
) => {
  return ram && motherboard ? motherboard.ram_type != ram.type : false
}

// Motherboard Case
export const motherboardIncompatibleWithCase = (
  pcCase: CaseType | null,
  motherboard: MotherboardType | null
) => {
  return motherboard && pcCase
    ? !pcCase.compatibility.includes(motherboard.form_factor)
    : false
}

// GPU Case
export const gpuIncompatibleWithCase = (
  pcCase: CaseType | null,
  gpu: GPUType | null
) => {
  return gpu && pcCase ? gpu.length > pcCase.max_vga_length : false
}

export const aioIncompatibleWithCase = (
  cooler: CoolerType | null,
  pcCase: CaseType | null
) => {
  return cooler && pcCase && cooler.is_liquid_cooler
    ? cooler.liquid_cooler_size > pcCase.radiator_support
    : false
}

export const airCoolerIncompatibleWithCase = (
  airCooler: CoolerType | null,
  pcCase: CaseType | null
) => {
  return airCooler && !airCooler.is_liquid_cooler && pcCase
    ? airCooler.air_cooler_height > pcCase.max_cpu_cooler_height
    : false
}

export const psuPowerNotEnough = (psuPower: number, totalPower: number) => {
  return totalPower > psuPower
}
