import PriceType from "../PriceType"

interface SSDType {
  Brand: string
  Name: string
  NameCN: string
  ReleaseDate: string
  Model: string
  Capacity: string
  MaxRead: number
  MaxWrite: number
  Interface: string
  FlashType: string
  FormFactor: string
  Prices: PriceType[]
  Img: string
}

export default SSDType
