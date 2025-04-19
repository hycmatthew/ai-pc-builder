import PriceType from "../PriceType"

interface CPUType {
  Id: string
  Name: string
  NameCN: string
  Brand: string
  Socket: string
  Cores: number
  Threads: number
  GPU: string
  SingleCoreScore: number
  MultiCoreScore: number
  IntegratedGraphicsScore: number
  Power: number
  Prices: PriceType[]
  Img: string
}

export default CPUType
