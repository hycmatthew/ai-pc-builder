import PriceType from "../PriceType"

interface MotherboardType {
  id: string
  name: string
  name_cn: string
  brand: string
  socket: string
  chipset: string
  ram_slot: number
  ram_type: string
  ram_support: number[]
  ram_max: number
  pcie_16_slot: number
  pcie_4_slot: number
  pcie_1_slot: number
  m2_slot: number
  sata_slot: number
  form_factor: string
  wireless: boolean
  prices: PriceType[]
  img: string
}

export default MotherboardType
