import PriceType from "../PriceType"

interface CoolerType {
  Id: string
  Brand: string
  Name: string
  NameCN: string
  ReleaseDate: string
  Sockets: string[]
  IsLiquidCooler: boolean
  LiquidCoolerSize: number
  AirCoolerHeight: number
  NoiseLevel: string
  FanSpeed: string
  Airflow: string
  Pressure: string
  LED: string
  Prices: PriceType[]
  Img: string
}

export default CoolerType
