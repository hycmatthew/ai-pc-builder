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
    const cpuBrand = cpu?.brand
    if (cpuBrand === CPUBrand.Intel) {
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
    const cpuBrand = cpu?.brand
    if (cpuBrand === CPUBrand.Intel) {
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

  const cpuBrand = cpu.brand.toUpperCase()
  if (cpuBrand === 'INTEL') {
    return !ram.profile_xmp // 不兼容当不支持XMP时返回true
  } else if (cpuBrand === 'AMD') {
    return !ram.profile_expo // 不兼容当不支持EXPO时返回true
  }
  // 处理未知CPU品牌
  return true
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

export const ramProfileIsNotMatchCPU = (
  ram: RAMType | null,
  cpu: CPUType | null
) => {
  if (!cpu || !ram) {
    return false
  }
  const cpuBrand = cpu.brand.toUpperCase()
  if (cpuBrand === 'INTEL') {
    return !ram.profile_xmp // 不兼容当不支持XMP时返回true
  } else if (cpuBrand === 'AMD') {
    return !ram.profile_expo // 不兼容当不支持EXPO时返回true
  }
  // 对于未知品牌CPU，返回不匹配
  return true
}

export const gpuMatchcpuSuggestion = (
  gpu: GPUType | null,
  cpu: CPUType | null
) => {
  if (cpu && gpu) {
    return gpu.benchmark > cpu.multi_core_score * 2
  }
  return false
}

export const ramSizeSuggestion = (ram: RAMType | null) => {
  return ram ? ram.capacity > 64 : false
}

export const aioSuggestion = (
  aio: CoolerType,
  cpu: CPUType,
  airCooler: FanType
) => {}
