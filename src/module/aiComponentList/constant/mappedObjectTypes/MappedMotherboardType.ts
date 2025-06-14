interface MappedMotherboardType {
  id: string
  brand: string
  socket: string
  chipset: string
  ramSlot: number
  ramType: string
  ramSupport: number[]
  ramMax: number
  formFactor: string
  price: number
}

export default MappedMotherboardType
