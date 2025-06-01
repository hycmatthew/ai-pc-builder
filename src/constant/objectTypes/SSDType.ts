import PriceType from '../PriceType'

interface SSDType {
  Brand: string
  Name: string
  NameCN: string
  ReleaseDate: string
  Model: string
  Capacity: number
  Interface: string
  FlashType: string
  FormFactor: string
  DRam: boolean
  MaxRead: number
  MaxWrite: number
  Read4K: number
  Write4K: number
  Prices: PriceType[]
  Img: string
}

export default SSDType
