import PriceType from '../PriceType'

interface SSDType {
  id: string
  brand: string
  name: string
  name_cn: string
  release_date: string
  model: string
  capacity: number
  interface: string
  flash_type: string
  form_factor: string
  d_ram: boolean
  max_read: number
  max_write: number
  read_4k: number
  write_4k: number
  prices: PriceType[]
  img: string
}

export default SSDType
