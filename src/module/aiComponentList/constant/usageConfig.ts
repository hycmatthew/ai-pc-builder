export enum BuildUsage {
  Balance = 'balance',
  Gaming = 'gaming',
  Rendering = 'rendering',
  AI = 'ai',
}

export type UsageConfig = {
  type: BuildUsage
  weights: { cpu: number; gpu: number }
  bottleneckTolerance: {
    idealGpuCpuRatio: number
    imbalanceSensitivity: number
  }
  ramOptimalCapacity: number
  ramSpeedWeight: number
  cpuBrandMultiplier: {
    intel: number
    amd: number
  }
  gpuBrandMultiplier: {
    nvidia: number
    amd: number
  }
}

export const BUILD_CONFIGS: Record<BuildUsage, UsageConfig> = {
  [BuildUsage.Balance]: {
    type: BuildUsage.Balance,
    weights: { cpu: 0.6, gpu: 0.4 },
    bottleneckTolerance: {
      idealGpuCpuRatio: 0,
      imbalanceSensitivity: 0.15,
    },
    ramOptimalCapacity: 32,
    ramSpeedWeight: 0.25,
    cpuBrandMultiplier: {
      intel: 1.0,
      amd: 0.95,
    },
    gpuBrandMultiplier: {
      nvidia: 1.0,
      amd: 0.95,
    },
  },
  [BuildUsage.Gaming]: {
    type: BuildUsage.Gaming,
    weights: { cpu: 0.35, gpu: 0.65 },
    bottleneckTolerance: {
      idealGpuCpuRatio: 0.4,
      imbalanceSensitivity: 0.2,
    },
    ramOptimalCapacity: 32,
    ramSpeedWeight: 0.6,
    cpuBrandMultiplier: {
      intel: 1.0,
      amd: 0.95,
    },
    gpuBrandMultiplier: {
      nvidia: 1.0,
      amd: 0.95,
    },
  },
  [BuildUsage.Rendering]: {
    type: BuildUsage.Rendering,
    weights: { cpu: 0.5, gpu: 0.5 },
    bottleneckTolerance: {
      idealGpuCpuRatio: 0.3,
      imbalanceSensitivity: 0.18,
    },
    ramOptimalCapacity: 64,
    ramSpeedWeight: 0.5,
    cpuBrandMultiplier: {
      intel: 1.0,
      amd: 0.95,
    },
    gpuBrandMultiplier: {
      nvidia: 1.0,
      amd: 0.95,
    },
  },
  [BuildUsage.AI]: {
    type: BuildUsage.AI,
    weights: { cpu: 0.2, gpu: 0.8 },
    bottleneckTolerance: {
      idealGpuCpuRatio: 0.8,
      imbalanceSensitivity: 0.1,
    },
    ramOptimalCapacity: 64,
    ramSpeedWeight: 0.4,
    cpuBrandMultiplier: {
      intel: 1.0,
      amd: 0.95,
    },
    gpuBrandMultiplier: {
      nvidia: 1.0,
      amd: 0.95,
    },
  },
}

// 示例用法
export function getUsageConfig(buildType: BuildUsage): UsageConfig {
  return BUILD_CONFIGS[buildType] || BUILD_CONFIGS[BuildUsage.Balance]
}
