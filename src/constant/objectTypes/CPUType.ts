import PriceType from "../PriceType"

interface CPUType {
  id: string
  name: string
  name_cn: string
  brand: string
  socket: string
  cores: number
  threads: number
  gpu: string
  single_core_score: number
  multi_core_score: number
  integrated_graphics_score: number
  power: number
  prices: PriceType[]
  img: string
}

export default CPUType
