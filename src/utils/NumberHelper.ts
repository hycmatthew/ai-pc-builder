import { compact, isEmpty, sum, toNumber } from 'lodash'
import i18n from '../config/i18n'
import { AIOType, MotherboardType, RAMType } from '../constant/objectTypes'
import { SelectedItemType } from '../store/rawDataReducer'

export const getSelectedCurrency = () => {
  switch (i18n.language) {
    case 'zh-TW':
      return 'PriceHK'
    case 'zh-CN':
      return 'PriceCN'
    default:
      return 'PriceUS'
  }
}

export const calculateTotalNumber = (numberList: string[]) => {
  let totalNumber = 0
  numberList.forEach((item) => {
    totalNumber += toNumber(item)
  })
  return totalNumber
}

export const addCurrencySign = (str: string) => {
  let currencySign = '$'

  if (i18n.language == 'zh-CN') {
    currencySign = '¥'
  }

  return isEmpty(str) ? ' - ' : `${currencySign}${str}`
}

export const stringToNumber = (str: string | undefined) => {
  return toNumber(str)
}

export const stringToNumberWithDP = (str: string) => {
  if (isEmpty(str)) {
    return ''
  }
  return toNumber(str).toFixed(2)
}

export const getCurrentPrice = (item: any) => {
  switch (i18n.language) {
    case 'zh-TW':
      return stringToNumberWithDP(item.PriceCN)
    case 'zh-CN':
      return stringToNumberWithDP(item.PriceCN)
    default:
      return stringToNumberWithDP(item.PriceCN)
  }
}

export const getCurrentPriceWithSign = (item: any) => {
  return addCurrencySign(getCurrentPrice(item))
}

export const getTotalPrice = (selectedItems: SelectedItemType) => {
  const numberList = [
    selectedItems.cpu?.[getSelectedCurrency()],
    selectedItems.gpu?.[getSelectedCurrency()],
    selectedItems.motherboard?.[getSelectedCurrency()],
    selectedItems.ram?.[getSelectedCurrency()],
    selectedItems.psu?.[getSelectedCurrency()],
    selectedItems.ssd?.[getSelectedCurrency()],
    selectedItems.aio?.[getSelectedCurrency()],
    selectedItems.airCooler?.[getSelectedCurrency()],
    selectedItems.pcCase?.[getSelectedCurrency()],
  ]

  const totolPrice = calculateTotalNumber(compact(numberList))
    .toFixed(2)
    .toString()
  return addCurrencySign(totolPrice)
}

export const getTotalPower = (selectedItems: SelectedItemType) => {
  const getAIOPower = (aio: AIOType | null) => {
    if (aio) {
      switch (aio.LiquidCoolerSize) {
        case 120:
          return 4
        case 240:
          return 7
        case 280:
          return 8
        case 360:
          return 10
        default:
          return 5
      }
    }
    return 0
  }

  const getRamPower = (ram: RAMType | null) => {
    let wattNum = 0
    if (ram) {
      wattNum = ram.Channel * 3
    }
    return wattNum
  }

  const getMotherboardPower = (motherboard: MotherboardType | null) => {
    let wattNum = 0
    if (motherboard) {
      if (motherboard.Chipset.includes("Z") || motherboard.Chipset.includes("X")){
        wattNum = 35
      }else{
        wattNum = 25
      }
    }
    return wattNum
  }

  const numberList = [
    selectedItems.cpu?.Power,
    selectedItems.gpu?.Power,
    getAIOPower(selectedItems.aio),
    getRamPower(selectedItems.ram),
    getMotherboardPower(selectedItems.motherboard)
  ]
  return sum(numberList) || 0
}
