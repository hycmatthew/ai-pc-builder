import PriceType from '../PriceType'

interface CaseType {
  id: string
  brand: string
  name: string
  name_cn: string
  release_date: string
  color: string
  case_size: string
  power_supply: boolean
  drive_bays_2: number
  drive_bays_3: number
  compatibility: string[]
  dimensions: number[]
  max_vga_length: number
  radiator_support: number
  max_cpu_cooler_height: number
  slots_num: number
  prices: PriceType[]
  img: string
}

export default CaseType
