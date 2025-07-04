import { PSUType } from '../../constant/objectTypes'

// Motherboard CPU
export const psuWithATX3 = (psu: PSUType | null) => {
  return psu ? psu.standard.includes('ATX 3') : false
}
