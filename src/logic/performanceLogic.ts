import { CPUType, GPUType, RAMType, SSDType } from '../constant/objectTypes'

export const ramPerformanceLogic = (ram: RAMType | null) => {
  if (ram) {
    const timingNum = ram.Latency
    const sizeMultiply = ram.Capacity > 16 ? 1 : ram.Capacity === 16 ? 0.8 : 0.5
    return ram.Speed * sizeMultiply - timingNum * 80
  }
  return 0
}

export const cpuPerformanceLogic = (cpu: CPUType | null) => {
  if (cpu) {
    return cpu.MultiCoreScore + cpu.SingleCoreScore * 5
  }
  return 0
}

export const gpuPerformanceLogic = (gpu: GPUType | null) => {
  if (gpu) {
    return gpu.Benchmark
  }
  return 0
}

export const ssdPerformanceLogic = (ssd: SSDType | null) => {
  const mainSSD = ssd
  if (mainSSD) {
    return (mainSSD.MaxRead + mainSSD.MaxWrite) * 0.2
  }
  return 0
}
