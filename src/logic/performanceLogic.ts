import { CPUType, GPUType, RAMType, SSDType } from '../constant/objectTypes'

export const ramPerformanceLogic = (ram: RAMType | null) => {
  if (!ram) return 0
  // 1. 容量权重：分段加权，避免过大容量的边际效应
  const getCapacityWeight = (capacity: number) => {
    if (capacity <= 8) return 0.5 // <=8GB: 最低权重
    if (capacity <= 16) return 0.8 // 16GB: 主流基础
    if (capacity <= 32) return 1.1 // 32GB: 最佳甜点
    if (capacity <= 64) return 1.15 // 64GB: 轻微衰减
    return 0.8 // >64GB: 继续衰减
  }

  // 2. 通道数乘数：双通道/四通道显著提升性能
  const getChannelMultiplier = (channel: number) => {
    return channel >= 2
      ? 1.2 // >双通道
      : 1.0 // 单通道
  }

  // 3. 计算真实延迟（纳秒）= (时序CL / 速度) * 2000
  const realLatencyNs = (ram.latency / ram.speed) * 2000

  // 4. 延迟惩罚系数（非线性惩罚）
  const getLatencyPenalty = (latencyNs: number) => {
    if (latencyNs <= 10) return 0 // 极低延迟不惩罚
    if (latencyNs <= 15) return 80 // 主流延迟
    if (latencyNs <= 20) return 150 // 较高延迟
    return 220 // 极高延迟
  }
  // 5. 基础分计算
  const baseScore = ram.speed * getCapacityWeight(ram.capacity)

  // 6. 应用通道数加成
  const channelBoostedScore = baseScore * getChannelMultiplier(ram.channel)

  // 7. 最终分数 = (通道加成后分数) - (真实延迟 * 动态惩罚系数)
  return Math.round(
    channelBoostedScore - realLatencyNs * getLatencyPenalty(realLatencyNs)
  )
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
  if (!ssd) return 0

  // 1. 基础性能计算（连续读写和随机读写）
  const seqPerf = (ssd.max_read + ssd.max_write) * 0.8 // 连续性能权重
  const randPerf = (ssd.read_4k + ssd.write_4k) * 1000 * 1.2 // 随机性能权重（转换为IOPS）

  // 2. 初始总分
  let totalScore = seqPerf + randPerf

  // 3. DRAM缓存加成（有DRAM提升15%）
  if (ssd.d_ram) {
    totalScore *= 1.15
  }

  // 4. 闪存类型调整
  if (ssd.flash_type === 'QLC') {
    totalScore *= 0.85 // QLC扣减15%
  }

  // 6. 转换为整数（千到万级别）
  return Math.round(totalScore / 30)
}
