import PriceType from '../PriceType'

interface GPUType {
  id: string
  name: string
  name_cn: string
  brand: string
  manufacturer: string
  series: string
  chipset: string
  generation: string
  memory_size: number
  memory_type: string
  memory_bus: number
  boost_clock: number
  benchmark: number
  power: number
  length: number
  slot: string
  prices: PriceType[]
  img: string
}

export default GPUType
