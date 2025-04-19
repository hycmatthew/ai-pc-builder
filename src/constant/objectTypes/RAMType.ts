import PriceType from "../PriceType"

interface RAMType {
  Brand: string
  Name: string
  NameCN: string
  Series: string
  Model: string
  Capacity: number
  Type: string
	Speed: number
  Timing: string
  Latency: number
  Voltage: string
  Channel: number
  Profile: string
  LED: string
  HeatSpreader: boolean
  Prices: PriceType[]
  Img: string
}

export default RAMType
