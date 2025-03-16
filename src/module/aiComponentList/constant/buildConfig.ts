const BuildConfig = {
  PriceList: [3000, 8000, 15000, 100000],
  MinPrice: 2500,
  HKPricingFactor: 1,
  CNPricingFactor: 1.1,
  USPricingFactor: 8,
  regularLogic: {
    formFactor: "ATX",
  },
  CPUFactor: {
    CPUBudgetFactor: [0.6, 0.6, 0.4, 0.3],
    SingleCoreMultiply: 5,
    MultiCoreMultiply: 1,
  },
  GPUFactor: {
    GPUBudgetFactor: [0.5, 0.7, 0.6, 0.5],
    GPUScoreMultiply: 4,
  },
  RAMFactor: {
    RAMBudgetFactor: [0.3, 0.3, 0.25, 0.2],
  },
  SSDFactor: {
    SSDBudgetFactor: [0.3, 0.3, 0.25, 0.2],
    SSDPriceFactor: [0.01, 0.01, 0.008, 0.007, 0.005],
    SSDSuggestion: ['WD BLACK SN770 1TB', 'Samsung 990 EVO 1TB', 'T500 1TB'],
  },
  PSUFactor: {
    PSUBudgetFactor: [0.01, 0.01, 0.008, 0.007, 0.005],
    PSUSuggestion: ["seasonic-focus-gx-750-v4", "thermaltake-toughpower-gf-a3-750w", "lian-li-edge-gold-850w"]
  },
  CPUCoolerFactor: {
    CPUCoolerSuggestion: {
      400: ['Peerless Assassin 120 SE'],
      200: ['Peerless Assassin 120 SE'],
    },
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
      mATX: ['aigo-jv13', 'sama-平头哥m2-air', 'montech-air-100-argb-white'],
    },
  },
}
0
export default BuildConfig
