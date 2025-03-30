import { CPUBrand } from '../../constant/BrandEnum'
import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  CoolerType,
  FanType,
} from '../../constant/objectTypes'
import { containStrUtil } from '../../utils/StringUtil'

export const motherboardOverclockSuggestion = (
  cpu: CPUType | null,
  motherboard: MotherboardType | null
) => {
  if (cpu && motherboard) {
    const cpuBrand = cpu?.Brand
    if (cpuBrand === CPUBrand.Intel) {
      if (containStrUtil(cpu?.Name, 'K')) {
        return !containStrUtil(motherboard?.Chipset, 'Z')
      }
    }
    if (containStrUtil(cpu?.Name, 'X')) {
      return !(
        containStrUtil(motherboard?.Chipset, 'X') ||
        containStrUtil(motherboard?.Chipset, 'B')
      )
    }
  }
  return false
}

export const motherboardChipsetSuggestion = (
  cpu: CPUType | null,
  motherboard: MotherboardType | null
) => {
  if (cpu && motherboard) {
    const cpuBrand = cpu?.Brand
    if (cpuBrand === CPUBrand.Intel) {
      if (cpu?.Name.includes('i3')) {
        return !motherboard?.Chipset.includes('H')
      }
      if (cpu?.Name.includes('i5')) {
        return !(
          motherboard?.Chipset.includes('H') ||
          motherboard?.Chipset.includes('B')
        )
      }
      if (cpu?.Name.includes('i7')) {
        return !(
          motherboard?.Chipset.includes('B') ||
          motherboard?.Chipset.includes('Z')
        )
      }
      if (cpu?.Name.includes('i9')) {
        return !motherboard?.Chipset.includes('Z')
      }
    } else {
      if (cpu?.Name.includes('Ryzen 3')) {
        return !motherboard?.Chipset.includes('A')
      }
      if (cpu?.Name.includes('Ryzen 5')) {
        return !(
          motherboard?.Chipset.includes('A') ||
          motherboard?.Chipset.includes('B')
        )
      }
      if (cpu?.Name.includes('Ryzen 7') || cpu?.Name.includes('Ryzen 9')) {
        return !motherboard?.Chipset.includes('X')
      }
    }
  }
  return false
}

// Motherboard CPU
export const ramIncompatibleWithCPU = (ram: RAMType, cpu: CPUType | null) => {
  return cpu && ram
    ? !ram.Profile.toUpperCase().includes(cpu.Brand.toUpperCase())
    : false
}

// Motherboard RAM
export const motherboardIncompatibleWithRamSpeed = (
  motherboard: MotherboardType | null,
  ram: RAMType | null
) => {
  return ram && motherboard ? !motherboard.RamSupport.includes(ram.Speed) : false
}

export const ramProfileIsNotMatchCPU = (
  ram: RAMType | null,
  cpu: CPUType | null
) => {
  if (cpu && ram) {
    return !ram?.Profile.toLowerCase().includes(cpu.Brand)
  }
  return false
}

export const gpuMatchcpuSuggestion = (gpu: GPUType | null, cpu: CPUType | null) => {
  if (cpu && gpu) {
    return gpu.Benchmark > cpu.MultiCoreScore * 2
  }
  return false
}

export const ramSizeSuggestion = (ram: RAMType | null) => {
  return ram ? ram.Capacity > 32 : false
}

export const aioSuggestion = (
  aio: CoolerType,
  cpu: CPUType,
  airCooler: FanType
) => {}
