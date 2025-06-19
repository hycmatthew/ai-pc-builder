interface MappedMotherboardType {
  id: string
  brand: string
  name: string
  socket: string
  chipset: string
  ramSlot: number
  ramType: string
  ramSupport: number[]
  ramMax: number
  formFactor: string
  score: number
  price: number
}

export default MappedMotherboardType
