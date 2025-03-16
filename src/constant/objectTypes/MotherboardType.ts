interface MotherboardType {
  Name: string
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
  PriceUS: string
  PriceHK: string
  PriceCN: string
  LinkUS: string
  LinkHK: string
  LinkCN: string
  Img: string
}

export default MotherboardType
