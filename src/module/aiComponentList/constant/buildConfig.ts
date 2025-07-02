const BuildConfig = {
  MinBuildPriceNum: 500,
  HKPricingFactor: 7.8,
  CNPricingFactor: 7.1,
  USPricingFactor: 1,
  RegularLogic: {
    formFactor: 'ATX',
  },
  BudgetLogic: {
    MinBudgetStart: 800,
    MaxBudgetStart: 3500,
  },
  CPUFactor: {
    CPUBudgetFactor: [0.6, 0.6, 0.4, 0.3],
    CPUBudgetMinFactor: 0.6,
    CPUBudgetMaxFactor: 0.3,
    SingleCoreMultiply: 2,
    MultiCoreMultiply: 1,
    OldSockets: ['AM4', 'LGA1700'],
  },
  GPUFactor: {
    GPUBudgetFactor: [0.5, 0.7, 0.6, 0.5],
    GPUBudgetMinFactor: 0.6,
    GPUBudgetMaxFactor: 0.6,
    GPUScoreMultiply: 4,
  },
  RAMFactor: {
    RAMBudgetFactor: [0.3, 0.3, 0.25, 0.2],
    RAMBudgetMinFactor: 0.3,
    RAMBudgetMaxFactor: 0.2,
  },
  SSDFactor: {
    SSDBudgetFactor: 0.25,
    SSDSuggestion: ['SN770', 'T500'],
    DefaultCapacity: 1000,
  },
  PSUFactor: {
    PSUBudgetFactor: 0.18,
    PSUSuggestion: [
      'seasonic-focus-gx-750-v4',
      'thermaltake-toughpower-gf-a3-750w',
      'lian-li-edge-gold-850w',
    ],
  },
  CoolerFactor: {
    CoolerBudgetFactor: 0.15,
    TDPThreshold: 170,
    IdealPriceFactors: {
      cpuRatio: 0.15, // CPU價格的15%
      budgetRatio: 0.02, // 總預算的3%
    },
    NormalCoolerSuggestion: [
      'idcooling-se-214-xt-argb',
      'arctic-freezer-36',
      'thermalright-peerless-assassin-120-se',
      'scythe-mugen-6',
      'thermalright-frozen-prism-360-black-argb',
    ],
    HighendCoolerSuggestion: [
      'thermalright-peerless-assassin-120-se',
      'noctua-nh-d15',
      'bequiet-dark-rock-5',
      'noctua-nh-d15-g2',
      'thermalright-frozen-prism-360-black-argb',
      'coolermaster-masterliquid-360-core-ii',
      'arctic-liquid-freezer-iii-pro-360',
    ],
    MATXCoolerSuggestion: [
      'lianli-galahad-ii-lcd-280',
      'coolermaster-masterliquid-240-atmos',
    ],
  },
  CaseFactor: {
    CaseSuggestion: {
      EATX: [
        'sama-颜之神mesh雪装版',
        'montech-air-903-max',
        'lian-li-lancool-216x',
      ],
      ATX: [
        'sama-朱雀air',
        'montech-air-903-max',
        'lian-li-lancool-216x',
        'fractal-design-meshify-c',
      ],
      mATX: [
        'aigo-jv13',
        'sama-平头哥m2-air',
        'montech-air-100-argb',
        'montech-air-100-argb-white',
      ],
    },
  },
}

export default BuildConfig
