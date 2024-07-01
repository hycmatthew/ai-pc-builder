import { compact, sum, toNumber } from 'lodash'
import i18n from '../config/i18n'
import { AIOType, RAMType } from '../constant/objectTypes'
import { SelectedItemType } from '../module/store/rawDataReducer'

export const getSelectedCurrency = () => {
  switch (i18n.language) {
    case 'zh-TW':
      return 'priceHK'
    case 'zh-CN':
      return 'priceCN'
    default:
      return 'priceUS'
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
  switch (i18n.language) {
    case 'zh-TW':
      return `$${str}`
    case 'zh-CN':
      return `¥${str}`
    default:
      return `$${str}`
  }
}

export const stringToNumber = (str: string | undefined) => {
  return toNumber(str)
}

export const stringToNumberWithDP = (str: string) => {
  return toNumber(str).toFixed(2)
}

export const getCurrentPrice = (item: any) => {
  switch (i18n.language) {
    case 'zh-TW':
      return stringToNumberWithDP(item.priceHK)
    case 'zh-CN':
      return stringToNumberWithDP(item.priceCN)
    default:
      return stringToNumberWithDP(item.priceUS)
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
      switch (aio.fanSize) {
        case 120:
          return 3
        case 240:
          return 6
        case 280:
          return 8
        case 360:
          return 9
        default:
          return 5
      }
    }
    return 0
  }

  const getRamPower = (ram: RAMType | null) => {
    return ram ? 5 : 0
  }

  const numberList = [
    selectedItems.cpu?.power,
    selectedItems.gpu?.power,
    getAIOPower(selectedItems.aio),
    getRamPower(selectedItems.ram),
  ]
  return sum(numberList) || 0
}
