import { m } from 'framer-motion'
import CaseSuggestion from '../../database/components/CaseSuggestion'

const buildConfig = {
  priceList: [3000, 8000, 15000, 100000],
  minPrice: 2500,
  hkPricingFactor: 1,
  cnPricingFactor: 1.1,
  usPricingFactor: 8,
  cpuFactor: {
    CPUBudgetFactor: [0.6, 0.6, 0.4, 0.3],
    singleCoreMultiply: 5,
    multiCoreMultiply: 1,
  },
  gpuFactor: {
    GPUBudgetFactor: [0.5, 0.7, 0.6, 0.5],
    gpuScoreMultiply: 4,
  },
  ramFactor: {
    RAMBudgetFactor: [0.3, 0.3, 0.25, 0.2],
  },
  ssdFactor: {
    SSDPriceFactor: [0.01, 0.01, 0.008, 0.007, 0.005],
  },
  psuFactor: {
    PSUBudgetFactor: [0.01, 0.01, 0.008, 0.007, 0.005],
  },
  cpuCoolerFactor: {
    cpuCoolerSuggestion: {
      EATX: ['颜之神Mesh雪装版'],
      ATX: ['朱雀air'],
      mATX: ['JV13', '平头哥M2 Air'],
    },
  },
  caseFactor: {
    CaseSuggestion: {
      EATX: ['颜之神Mesh雪装版'],
      ATX: ['朱雀air'],
      mATX: ['JV13', '平头哥M2 Air'],
    },
  },
}
0
export default buildConfig
