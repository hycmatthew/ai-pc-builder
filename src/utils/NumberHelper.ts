import { compact, isEmpty, sum, toNumber } from 'lodash'
import i18n from '../config/i18n'
import { CoolerType, MotherboardType, RAMType } from '../constant/objectTypes'
import { SelectedItemType } from '../store/rawDataReducer'
import { STR_CONSTANTS } from '../constant/StringConstant'
import { LangEnum } from '../constant/supportedLang'

// ==================== 價格相關工具函式 ====================
type PriceKey = 'PriceHK' | 'PriceCN' | 'PriceUS'

// 使用映射表取代 switch-case
const CURRENCY_MAP: Record<LangEnum, { key: PriceKey; sign: string }> = {
  [LangEnum.zhTW]: { key: 'PriceHK', sign: '$' },
  [LangEnum.zhCN]: { key: 'PriceCN', sign: '¥' },
  [LangEnum.en]: { key: 'PriceUS', sign: '$' },
}

// 獲取貨幣配置的通用方法
const getCurrencyConfig = () =>
  CURRENCY_MAP[i18n.language as LangEnum] || CURRENCY_MAP[LangEnum.en]

// 合併重複的價格處理邏輯
const handlePriceValue = (value?: string | number) => {
  if (!value || value === STR_CONSTANTS.OUT_OF_STOCK) return ''
  return typeof value === 'string' ? stringToNumberWithDP(value) : value.toFixed(2)
}

// ==================== 核心工具函式 ====================
export const getSelectedCurrency = (): PriceKey => getCurrencyConfig().key

export const stringToNumber = (str: string | undefined) => {
  return toNumber(str)
}

export const stringToNumberWithDP = (str: string) => {
  if (isEmpty(str) || str == STR_CONSTANTS.OUT_OF_STOCK) {
    return ''
  }
  return toNumber(str).toFixed(2)
}

export const calculateTotalNumber = (numberList: string[]): number =>
  numberList.reduce((acc, curr) => acc + toNumber(curr), 0)

export const addCurrencySign = (value?: string | number): string => {
  const { sign } = getCurrencyConfig()
  const formattedValue = handlePriceValue(value)
  return isEmpty(formattedValue) ? ' - ' : `${sign}${formattedValue}`
}

export const getCurrentPrice = (
  item: Record<PriceKey, string | number>
): string => handlePriceValue(item[getSelectedCurrency()])

export const getCurrentPriceNum = (
  item: Record<PriceKey, string | number>
): number => toNumber(item[getSelectedCurrency()])

export const getCurrentPriceWithSign = (
  item: any
): string => addCurrencySign(getCurrentPrice(item))


export const getTotalPrice = (selectedItems: SelectedItemType) => {
  const numberList = [
    selectedItems.cpu?.[getSelectedCurrency()],
    selectedItems.gpu?.[getSelectedCurrency()],
    selectedItems.motherboard?.[getSelectedCurrency()],
    selectedItems.ram?.[getSelectedCurrency()],
    selectedItems.psu?.[getSelectedCurrency()],
    selectedItems.ssd?.[getSelectedCurrency()],
    selectedItems.cooler?.[getSelectedCurrency()],
    // selectedItems.fan?.[getSelectedCurrency()],
    selectedItems.pcCase?.[getSelectedCurrency()],
  ]

  return calculateTotalNumber(compact(numberList))
}

export const getTotalPriceStr = (selectedItems: SelectedItemType) => {
  const totolPrice = getTotalPrice(selectedItems).toFixed(2).toString()
  return addCurrencySign(totolPrice)
}


// ==================== 功耗計算工具函式 ====================
// 功耗計算器類型
type PowerCalculator<T> = (component: T | null) => number

// AIO 功耗計算
const calculateAioPower: PowerCalculator<CoolerType> = (aio) => {
  if (!aio) return 0
  const powerMap: Record<number, number> = {
    120: 4,
    240: 7,
    280: 8,
    360: 10,
  }
  return powerMap[aio.LiquidCoolerSize] ?? 5
}

// RAM 功耗計算
const calculateRamPower: PowerCalculator<RAMType> = (ram) => {
  return ram?.Channel ? ram.Channel * 3 : 0
}

// 主機板功耗計算
const calculateMotherboardPower: PowerCalculator<MotherboardType> = (
  motherboard
) => {
  if (!motherboard) return 0
  return /[ZX]/.test(motherboard.Chipset) ? 35 : 25
}

export const getTotalPower = (selectedItems: SelectedItemType): number => {
  const powerComponents = [
    selectedItems.cpu?.Power,
    selectedItems.gpu?.Power,
    calculateAioPower(selectedItems.cooler),
    calculateRamPower(selectedItems.ram),
    calculateMotherboardPower(selectedItems.motherboard),
  ]

  console.log(`getTotalPower : ${sum(powerComponents)}`)
  return sum(powerComponents) || 0
}
