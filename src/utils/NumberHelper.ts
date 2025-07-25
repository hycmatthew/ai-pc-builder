import { sum, toNumber, isNaN } from 'lodash'
import {
  AllType,
  CoolerType,
  MotherboardType,
  RAMType,
} from '../constant/objectTypes'
import { SelectedItemType } from '../store/rawDataReducer'
import { LangEnum } from '../constant/supportedLang'
import PriceType from '../constant/PriceType'

// ==================== 價格相關工具函式 ====================
type RegionKey = 'HK' | 'CN' | 'US' // 根據實際需求擴展

// 使用映射表取代 switch-case（調整為使用 Region）
const CURRENCY_MAP: Record<LangEnum, { region: RegionKey; sign: string }> = {
  [LangEnum.zhTW]: { region: 'HK', sign: '$' },
  [LangEnum.zhCN]: { region: 'CN', sign: '¥' },
  [LangEnum.en]: { region: 'US', sign: '$' },
}

// 獲取貨幣配置的通用方法
const getCurrencyConfig = () => CURRENCY_MAP[LangEnum.en]

// 合併重複的價格處理邏輯
const handlePriceValue = (value?: string | number) => {
  const testVal = toNumber(value)
  if (isNaN(testVal) || isZero(testVal)) return ''
  return testVal.toFixed(2)
}

export const stringToNumber = (str: string | undefined) => {
  return toNumber(str)
}

const isZero = (value: string | number): boolean => {
  // 处理字符串类型：去空格、空字符串直接返回 false
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') return false
    value = trimmed
  }

  const num = Number(value)
  return !isNaN(num) && num == 0
}

export const normalizeNumberWithDP = (str: string | number) => {
  const res = handlePriceValue(str)
  return res === '' ? '-' : res
}

export const calculateTotalNumber = (numberList: number[]): number =>
  numberList.reduce((acc, curr) => acc + curr, 0)

// ==================== 核心工具函式 ====================
export const getAllPriceByRegion = (prices: PriceType[] | null) => {
  const { region } = getCurrencyConfig()
  return (
    prices?.filter((p) => p.region === region && toNumber(p.price) > 0) || []
  )
}

const getPriceByRegion = (prices: PriceType[] | null): number => {
  const { region } = getCurrencyConfig()

  if (!prices || prices.length === 0) return 0

  // 使用 Lodash 的 toNumber 进行转换
  const validPrices = prices
    .filter((p) => p.region === region && p.price)
    .map((p) => {
      // 使用 toNumber 转换价格
      const num = toNumber(p.price)
      // 处理可能的 NaN 或无效值
      return isNaN(num) ? 0 : num
    })
    .filter((price) => price > 0) // 确保价格是正数

  if (validPrices.length === 0) return 0
  return Math.min(...validPrices)
}

// 調整貨幣符號添加方式
export const addCurrencySign = (value?: string | number): string => {
  const { sign } = getCurrencyConfig()
  return handlePriceValue(value) === '' ? ' - ' : `${sign}${value}`
}

export const getCurrentPriceWithSign = (item: AllType): string =>
  addCurrencySign(convertLocalizedPrice(item))

// 調整本地化價格轉換
export const convertLocalizedPrice = (item: {
  prices: PriceType[]
}): string => {
  return handlePriceValue(getPriceByRegion(item.prices))
}

// 調整獲取當前價格數值
export const getLocalizedPriceNum = (item: { prices: PriceType[] }): number => {
  return getPriceByRegion(item.prices)
}

// 調整總價計算邏輯
export const getTotalPrice = (selectedItems: SelectedItemType) => {
  const numberList = [
    getPriceByRegion(selectedItems.cpu?.prices || []),
    getPriceByRegion(selectedItems.gpu?.prices || []),
    getPriceByRegion(selectedItems.motherboard?.prices || []),
    getPriceByRegion(selectedItems.ram?.prices || []),
    getPriceByRegion(selectedItems.psu?.prices || []),
    getPriceByRegion(selectedItems.ssd?.prices || []),
    getPriceByRegion(selectedItems.cooler?.prices || []),
    getPriceByRegion(selectedItems.pcCase?.prices || []),
  ]
  return calculateTotalNumber(numberList)
}

// 保持其他函式簽名不變
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
  return powerMap[aio.liquid_cooler_size] ?? 5
}

// RAM 功耗計算
const calculateRamPower: PowerCalculator<RAMType> = (ram) => {
  return ram?.channel ? ram.channel * 3 : 0
}

// 主機板功耗計算
const calculateMotherboardPower: PowerCalculator<MotherboardType> = (
  motherboard
) => {
  if (!motherboard) return 0
  return /[ZX]/.test(motherboard.chipset) ? 35 : 25
}

export const getTotalPower = (selectedItems: SelectedItemType): number => {
  const powerComponents = [
    selectedItems.cpu?.power,
    selectedItems.gpu?.power,
    calculateAioPower(selectedItems.cooler),
    calculateRamPower(selectedItems.ram),
    calculateMotherboardPower(selectedItems.motherboard),
  ]

  return sum(powerComponents) || 0
}

// ==================== Performance Logic ====================
export const calculatePricePerformance = (
  performance: number,
  price: number | string
): number => {
  // 性能分數有效性檢查
  const validPerformance =
    typeof performance === 'number' && !isNaN(performance) ? performance : 0

  // 價格轉換與有效性檢查
  let numericPrice = toNumber(price)

  // 邊界條件檢查
  if (
    validPerformance === 0 ||
    numericPrice === 0 ||
    isNaN(numericPrice) ||
    !isFinite(numericPrice)
  ) {
    return 0
  }

  // 核心計算與結果驗證
  const result = validPerformance / numericPrice
  return isFinite(result) ? result : 0
}
