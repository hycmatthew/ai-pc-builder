interface CaseType {
  brand: string
  series: string
  model: string
  type: string
  motherboardCompatibility: string[]
  window: string
  maxGPULength: number
  maxPSULength: number
  maxCPUCoolerLength: number
  radiatorOptions: number[][]
  powerSupplyPos: string
  weight: string
  size: string[]
  color: string
  priceUS: string
  priceHK: string
  priceCN: string
  img: string
}

export default CaseType
