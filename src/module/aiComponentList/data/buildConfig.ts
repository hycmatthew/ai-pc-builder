const buildConfig = {
  priceList: [3000, 4500, 6000, 9000, 12000, 15000, 25000, 90000],
  minPrice: 2500,
  hkPricingFactor: 1,
  cnPricingFactor: 1.1,
  usPricingFactor: 8,
  cpuFactor: {
    CPUBudgetNFactor: [0.4, 0.35, 0.3, 0.25],
    CPUBudgetGFactor: [0.4, 0.35, 0.3, 0.25],
    singleCoreMultiply: 5,
    multiCoreMultiply: 1,
  },
  ramFactor: {
    RAMBudgetFactor: [0.3, 0.3, 0.25, 0.2],
  },
  ssdFactor: {
    SSDPriceFactor: [0.01, 0.01, 0.008, 0.007, 0.005],
  },
  psuFactor: {
    PSUBudgetFactor: [0.01, 0.01, 0.008, 0.007, 0.005],
  }
}

export default buildConfig
