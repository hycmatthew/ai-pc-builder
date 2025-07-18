import { CPUBrand } from '../../constant/BrandEnum'
import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
} from '../../constant/objectTypes'
import { isAMDCPU } from '../../utils/PCPartUtil'
import { containStrUtil } from '../../utils/StringUtil'

export const motherboardOverclockSuggestion = (
  cpu: CPUType | null,
  motherboard: MotherboardType | null
) => {
  if (cpu && motherboard) {
    if (!isAMDCPU(cpu)) {
      if (containStrUtil(cpu?.name, 'K')) {
        return !containStrUtil(motherboard?.chipset, 'Z')
      }
    }
    if (containStrUtil(cpu?.name, 'X')) {
      return !(
        containStrUtil(motherboard?.chipset, 'X') ||
        containStrUtil(motherboard?.chipset, 'B')
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
    if (!isAMDCPU(cpu)) {
      if (cpu?.name.includes('i3')) {
        return !motherboard?.chipset.includes('H')
      }
      if (cpu?.name.includes('i5')) {
        return !(
          motherboard?.chipset.includes('H') ||
          motherboard?.chipset.includes('B')
        )
      }
      if (cpu?.name.includes('i7')) {
        return !(
          motherboard?.chipset.includes('B') ||
          motherboard?.chipset.includes('Z')
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
          motherboard?.chipset.includes('A') ||
          motherboard?.chipset.includes('B')
        )
      }
      if (cpu?.name.includes('Ryzen 7') || cpu?.name.includes('Ryzen 9')) {
        return !motherboard?.chipset.includes('X')
      }
    }
  }
  return false
}

// Motherboard CPU
export const ramIncompatibleWithCPU = (ram: RAMType, cpu: CPUType | null) => {
  if (!cpu || !ram) {
    return false
  }
  if (isAMDCPU(cpu)) {
    return !ram.profile_expo
  }
  return !ram.profile_xmp
}

// Motherboard RAM
export const motherboardIncompatibleWithRamSpeed = (
  motherboard: MotherboardType | null,
  ram: RAMType | null
) => {
  return ram && motherboard
    ? !motherboard.ram_support.includes(ram.speed)
    : false
}

export const gpuMatchcpuSuggestion = (
  gpu: GPUType | null,
  cpu: CPUType | null
) => {
  if (cpu && gpu) {
    const testScore = cpu.multi_core_score * 0.5
    return testScore > gpu.benchmark
  }
  return false
}

export const ramSizeSuggestion = (ram: RAMType | null) => {
  return ram ? ram.capacity > 64 : false
}
