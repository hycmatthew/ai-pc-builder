export enum BuildType {
  Balance = 'balance',
  Gaming = 'gaming',
  Rendering = 'rendering',
  AI = 'ai',
}

export const BUILD_WEIGHTS = {
  balance: { cpu: 0.6, gpu: 0.4 }, // 办公更依赖 CPU
  gaming: { cpu: 0.35, gpu: 0.65 }, // 游戏更依赖 GPU
  rendering: { cpu: 0.5, gpu: 0.5 }, // 渲染依赖 CPU 和 GPU
  ai: { cpu: 0.2, gpu: 0.8 },
  unknown: { cpu: 0.5, gpu: 0.5 },
}

export const BOTTLENECK_TOLERANCE: Record<
  BuildType,
  {
    idealGpuCpuRatio: number // 理想GPU相对CPU的性能差值
    imbalanceSensitivity: number // 不平衡敏感度(0-0.3)
  }
> = {
  balance: {
    idealGpuCpuRatio: 0, // GPU和CPU性能相当
    imbalanceSensitivity: 0.15, // 中等敏感度
  },
  gaming: {
    idealGpuCpuRatio: 0.4, // GPU应比CPU强40%
    imbalanceSensitivity: 0.2, // 较高敏感度
  },
  rendering: {
    idealGpuCpuRatio: 0.3, // GPU应比CPU强30%
    imbalanceSensitivity: 0.18, // 中高敏感度
  },
  ai: {
    idealGpuCpuRatio: 0.8, // GPU应比CPU强80%
    imbalanceSensitivity: 0.1, // 低敏感度
  },
}

// 芯片组等级映射（基于命名规则）
export const CHIPSET_POWER_RANK: Record<
  string,
  { rank: number; powerSupport: number; class: number; generation: number }
> = {
  Z890: { rank: 1.0, powerSupport: 300, class: 4, generation: 800 },
  Z790: { rank: 0.98, powerSupport: 280, class: 4, generation: 700 },
  Z690: { rank: 0.95, powerSupport: 270, class: 4, generation: 600 },
  H770: { rank: 0.85, powerSupport: 220, class: 3, generation: 700 },
  B860: { rank: 0.82, powerSupport: 200, class: 3, generation: 800 },
  B760: { rank: 0.8, powerSupport: 200, class: 3, generation: 700 },
  H670: { rank: 0.78, powerSupport: 190, class: 3, generation: 600 },
  B660: { rank: 0.75, powerSupport: 190, class: 3, generation: 600 },
  H610: { rank: 0.65, powerSupport: 120, class: 2, generation: 600 },
  X870: { rank: 1.0, powerSupport: 300, class: 4, generation: 800 },
  X670: { rank: 0.95, powerSupport: 280, class: 4, generation: 600 },
  B850: { rank: 0.85, powerSupport: 220, class: 3, generation: 800 },
  B650: { rank: 0.8, powerSupport: 200, class: 3, generation: 600 },
  B840: { rank: 0.75, powerSupport: 180, class: 2, generation: 800 },
  A620: { rank: 0.65, powerSupport: 130, class: 2, generation: 600 },
}

// 芯片組命名規則解析（保持不變）
export const CHIPSET_RULES = {
  intel: {
    Z: {
      baseClass: 4,
      rankModifier: 1.0,
      powerBase: 300,
      generationFactor: 0.02,
    },
    H: {
      baseClass: 3,
      rankModifier: 0.8,
      powerBase: 180,
      generationFactor: 0.01,
    },
    B: {
      baseClass: 3,
      rankModifier: 0.8,
      powerBase: 180,
      generationFactor: 0.01,
    },
    W: {
      baseClass: 5,
      rankModifier: 1.1,
      powerBase: 350,
      generationFactor: 0.03,
    },
  },
  amd: {
    X: {
      baseClass: 4,
      rankModifier: 1.0,
      powerBase: 300,
      generationFactor: 0.02,
    },
    B: {
      baseClass: 3,
      rankModifier: 0.8,
      powerBase: 180,
      generationFactor: 0.01,
    },
    A: {
      baseClass: 2,
      rankModifier: 0.7,
      powerBase: 130,
      generationFactor: 0.005,
    },
  },
}

// 品牌评分映射表（更新）
export const BRAND_POWER_SCORE: Record<string, number> = {
  asus: 1.1, // 一线品牌
  msi: 1.05, // 一线品牌
  gigabyte: 1.0, // 准一线
  asrock: 0.95, // 二线品牌 -5%
  biostar: 0.9, // 三线品牌 -10%
  colorful: 0.9, // 三线品牌 -10%
  _default: 1.0,
}

// 尺寸惩罚系数（更新）
export const FORM_FACTOR_PENALTY: Record<string, number> = {
  'MINI-ITX': 0.85, // 扣15%分
  'MICRO-ATX': 0.95, // 扣5%分
  ATX: 1.0, // 不扣分
  'E-ATX': 0.95,
}

export const MOTHERBOARD_SERIES_FACTOR: Record<string, number> = {
  // ASUS 系列
  'ROG MAXIMUS': 1.25, // 旗舰系列
  'ROG STRIX': 1.2, // 高端游戏系列
  'ROG CROSSHAIR': 1.2,
  'TUF GAMING': 1.15, // 耐用游戏系列
  PRIME: 1.1, // 主流系列
  PROART: 1.2, // 创作者系列

  // MSI 系列
  MEG: 1.25, // 旗舰系列
  PRESTIGE: 1.2, // 高端创作者系列
  MPG: 1.2, // 性能游戏系列
  MAG: 1.15, // 游戏系列
  PRO: 1.1, // 商用系列

  // Gigabyte 系列
  'AORUS XTREME': 1.25,
  'AORUS MASTER': 1.2,
  'AORUS ELITE': 1.15,
  AERO: 1.2, // 创作者系列
  GAMING: 1.15,
  UD: 1.1, // 超耐用系列

  // ASRock 系列
  AQUA: 1.25, // 旗舰水冷系列
  TAICHI: 1.2, // 高端系列
  'PHANTOM GAMING': 1.15,
  'STEEL LEGEND': 1.1,

  // 默认系数
  _default: 1.0,
}

/****************************** Ram Score Logic ******************************/
export const RAM_BRAND_FACTOR: Record<string, number> = {
  CORSAIR: 1.1,
  'G.SKILL': 1.1,
  KINGSTON: 1.05,
  ADATA: 0.95,
  _default: 1.0,
}

export const RAM_OPTIMAL_CAPACITY: Record<BuildType, number> = {
  gaming: 32,
  balance: 32,
  rendering: 64,
  ai: 64,
}

// 定义不同用途的速度权重
export const RAM_SPEED_WEIGHTS: Record<BuildType, number> = {
  gaming: 0.6,
  balance: 0.25,
  rendering: 0.5,
  ai: 0.4,
}

/****************************** Cooler Score Logic ******************************/
export const COOLER_BRAND_SCORES: Record<string, number> = {
  Noctua: 1.2,
  'be quiet!': 1.15,
  Corsair: 1.1,
  Deepcool: 1.05,
  'Cooler Master': 1.05,
  _default: 1.0,
}
