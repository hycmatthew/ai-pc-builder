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
  if (!ssd) return 0;
  
  // 1. 基础性能计算（连续读写和随机读写）
  const seqPerf = (ssd.max_read + ssd.max_write) * 0.8; // 连续性能权重
  const randPerf = ((ssd.read_4k + ssd.write_4k) * 1000) * 1.2; // 随机性能权重（转换为IOPS）
  
  // 2. 初始总分
  let totalScore = seqPerf + randPerf;
  
  // 3. DRAM缓存加成（有DRAM提升15%）
  if (ssd.d_ram) {
    totalScore *= 1.15;
  }
  
  // 4. 闪存类型调整
  if (ssd.flash_type === "QLC") {
    totalScore *= 0.85; // QLC扣减15%
  }
  
  // 6. 转换为整数（千到万级别）
  return Math.round(totalScore/30);
};