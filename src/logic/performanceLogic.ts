import {
  CPUType,
  GPUType,
  RAMType,
  SSDType
} from '../constant/objectTypes'

export const ramPerformanceLogic = (ram: RAMType | null) => {
  if (ram) {
    const timingNum = Number(ram.Timing.split("-")[0]);
    return ram.Speed - (timingNum * 80)
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
  if (ssd) {
    return (ssd.MaxRead + ssd.MaxWrite) * 0.2
  }
  return 0
}
