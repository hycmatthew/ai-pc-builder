const BuildConfig = {
  MinBuildPriceNum: 500,
  HKPricingFactor: 7.8,
  CNPricingFactor: 7.1,
  USPricingFactor: 1,
  RegularLogic: {
    formFactor: 'ATX',
  },
  BudgetLogic: {
    MinBudgetStart: 1000,
    MaxBudgetStart: 3500,
  },
  CPUFactor: {
    CPUBudgetFactor: [0.6, 0.6, 0.4, 0.3],
    CPUBudgetMinFactor: 0.6,
    CPUBudgetMaxFactor: 0.3,
    SingleCoreMultiply: 2,
    MultiCoreMultiply: 1,
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
    SSDBudgetFactor: [0.3, 0.3, 0.25, 0.2],
    SSDBudgetMinFactor: 0.3,
    SSDBudgetMaxFactor: 0.2,
    SSDSuggestion: ['WD BLACK SN770 1TB', 'Samsung 990 EVO 1TB', 'T500 1TB'],
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
  CPUCoolerFactor: {
    AIOCoolerSuggestion: [
      'thermalright-peerless-assassin-120-se',
      'scythe-mugen-6',
      'id-cooling-se-214-xt-argb',
      'id-cooling-se-214-xt-argb-white',
    ],
    AirCoolerSuggestion: [
      'thermalright-peerless-assassin-120-se',
      'scythe-mugen-6',
      'id-cooling-se-214-xt-argb',
      'id-cooling-se-214-xt-argb-white',
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
