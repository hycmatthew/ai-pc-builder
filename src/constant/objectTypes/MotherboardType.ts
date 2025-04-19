import PriceType from "../PriceType"

interface MotherboardType {
  Id: string
  Name: string
  NameCN: string
  Brand: string
  Socket: string
  Chipset: string
  RamSlot: number
  RamType: string
  RamSupport: number[]
  RamMax: number
  Pcie16Slot: number
  Pcie4Slot: number
  Pcie1Slot: number
  M2Slot: number
  SataSlot: number
  FormFactor: string
  Wireless: boolean
  Prices: PriceType[]
  Img: string
}

export default MotherboardType
