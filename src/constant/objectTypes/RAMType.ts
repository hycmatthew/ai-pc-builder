import PriceType from "../PriceType"

interface RAMType {
  id: string
  brand: string
  name: string
  name_cn: string
  series: string
  model: string
  capacity: number
  type: string
	speed: number
  timing: string
  latency: number
  voltage: string
  channel: number
  profile_expo: boolean
  profile_xmp: boolean
  led: string
  heat_spreader: boolean
  prices: PriceType[]
  img: string
}

export default RAMType
