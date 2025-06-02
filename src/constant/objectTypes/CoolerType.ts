import PriceType from "../PriceType"

interface CoolerType {
  id: string
  brand: string
  name: string
  name_cn: string
  release_date: string
  sockets: string[]
  is_liquid_cooler: boolean
  liquid_cooler_size: number
  air_cooler_height: number
  noise_level: string
  fan_speed: string
  airflow: string
  pressure: string
  led: string
  prices: PriceType[]
  img: string
}

export default CoolerType
