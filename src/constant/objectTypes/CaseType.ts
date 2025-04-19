import PriceType from '../PriceType'

interface CaseType {
  Id: string
  Brand: string
  Name: string
  NameCN: string
  ReleaseDate: string
  Color: string
  CaseSize: string
  PowerSupply: boolean
  DriveBays2: number
  DriveBays3: number
  Compatibility: string[]
  Dimensions: number[]
  MaxVGAlength: number
  RadiatorSupport: number
  MaxCpuCoolorHeight: number
  SlotsNum: number
  Prices: PriceType[]
  Img: string
}

export default CaseType
