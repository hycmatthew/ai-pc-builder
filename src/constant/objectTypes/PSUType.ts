import PriceType from "../PriceType"

interface PSUType {
  id: string
  brand: string
  name: string
  name_cn: string
  release_date: string
  wattage: number
  size: string
  standard: string
  modular: string
  efficiency: string
  length: number
  prices: PriceType[]
  img: string
}

export default PSUType
