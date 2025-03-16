interface CoolerType {
  Id: string
  Brand: string
  Name: string
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
  PriceUS: string
  PriceHK: string
  PriceCN: string
  LinkUS: string
  LinkHK: string
  LinkCN: string
  Img: string
}

export default CoolerType
