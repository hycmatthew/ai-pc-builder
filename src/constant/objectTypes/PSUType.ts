import PriceType from "../PriceType"

interface PSUType {
  Id: string
  Brand: string
  Name: string
  NameCN: string
  ReleaseDate: string
  Wattage: number
  Size: string
  Standard: string
  Modular: string
  Efficiency: string
  Length: number
  Prices: PriceType[]
  Img: string
}

export default PSUType
