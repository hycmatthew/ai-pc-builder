import PriceType from "../PriceType"

interface GPUType {
  Id: string
  Name: string
  NameCN: string
  Brand: string
  Manufacturer: string
  Series: string
  Generation: string
  MemorySize: number
  MemoryType: string
  MemoryBus: string
  BoostClock: number
  OcClock: number
  Benchmark: number
  Power: number
  Length: number
  Slot: string
  Prices: PriceType[]
  Img: string
}

export default GPUType
