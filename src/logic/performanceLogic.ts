import { CPUType, GPUType, RAMType, SSDType } from '../constant/objectTypes'

export const ramPerformanceLogic = (ram: RAMType | null) => {
  if (ram) {
    const timingNum = ram.latency
    const sizeMultiply = ram.capacity > 16 ? 1 : ram.capacity === 16 ? 0.8 : 0.5
    return ram.speed * sizeMultiply - timingNum * 80
  }
  return 0
}

export const cpuPerformanceLogic = (cpu: CPUType | null) => {
  if (cpu) {
    return cpu.multi_core_score + cpu.single_core_score * 5
  }
  return 0
}

export const gpuPerformanceLogic = (gpu: GPUType | null) => {
  if (gpu) {
    return gpu.benchmark
  }
  return 0
}

export const ssdPerformanceLogic = (ssd: SSDType | null) => {
  const mainSSD = ssd
  if (mainSSD) {
    return (mainSSD.max_read + mainSSD.max_write) * 0.2
  }
  return 0
}
