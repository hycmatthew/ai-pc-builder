import { CPUBrand } from '../constant/BrandEnum'
import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  CaseType,
  AIOType,
  AirCoolerType,
  SSDType,
} from '../constant/objectTypes'

export const motherboardOverclockSuggestion = (
  motherboard: MotherboardType | null,
  cpu: CPUType | null
) => {
  if (cpu && motherboard) {
    const cpuBrand = cpu?.brand
    if (cpuBrand === CPUBrand.Intel) {
      if (cpu?.name.includes('K')) {
        return !motherboard?.chipset.includes('Z')
      }
    }
    if (cpu?.name.includes('X')) {
      return !(
        motherboard?.chipset.includes('X') || motherboard?.chipset.includes('B')
      )
    }
  }
  return false
}

export const motherboardChipsetSuggestion = (
  motherboard: MotherboardType | null,
  cpu: CPUType | null
) => {
  if (cpu && motherboard) {
    const cpuBrand = cpu?.brand
    if (cpuBrand === CPUBrand.Intel) {
      if (cpu?.name.includes('i3')) {
        return !motherboard?.chipset.includes('H')
      }
      if (cpu?.name.includes('i5')) {
        return !(
          motherboard?.chipset.includes('H') || motherboard?.chipset.includes('B')
        )
      }
      if (cpu?.name.includes('i7')) {
        return !(
          motherboard?.chipset.includes('B') || motherboard?.chipset.includes('Z')
        )
      }
      if (cpu?.name.includes('i9')) {
        return !motherboard?.chipset.includes('Z')
      }
    } else {
      if (cpu?.name.includes('Ryzen 3')) {
        return !motherboard?.chipset.includes('A')
      }
      if (cpu?.name.includes('Ryzen 5')) {
        return !(
          motherboard?.chipset.includes('A') || motherboard?.chipset.includes('B')
        )
      }
      if (cpu?.name.includes('Ryzen 7') || cpu?.name.includes('Ryzen 9')) {
        return !motherboard?.chipset.includes('X')
      }
    }
  }
  return false
}

export const ramProfileIsNotMatchCPU = (
  ram: RAMType | null,
  cpu: CPUType | null
) => {
  if (cpu && ram) {
    return !(ram?.chipset.includes(cpu.brand))
  }
  return false
}

export const gpuMatchcpuSuggestion = (gpu: GPUType, cpu: CPUType) => {
  if (cpu && gpu) {
    return gpu.firestrikeScore > (cpu.multiCoreScore * 2)
  }
  return false
}

export const ramSizeSuggestion = (ram: RAMType) => {
  return ram.capacityNum > 32
}

export const aioSuggestion = (aio: AIOType, cpu: CPUType, airCooler: AirCoolerType) => {
}
