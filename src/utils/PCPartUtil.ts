import { t } from 'i18next'
import { SelectedItemType } from '../store/rawDataReducer'
import ProductEnum from '../constant/ProductEnum'
import {
  addCurrencySign,
  calculateTotalNumber,
  getCurrentPriceWithSign,
  getSelectedCurrency,
} from './NumberHelper'
import { compact } from 'lodash'

export const getTotalPrice = (selectedItems: SelectedItemType) => {
  const numberList = [
    selectedItems.cpu?.[getSelectedCurrency()],
    selectedItems.gpu?.[getSelectedCurrency()],
    selectedItems.motherboard?.[getSelectedCurrency()],
    selectedItems.ram?.[getSelectedCurrency()],
    selectedItems.psu?.[getSelectedCurrency()],
    selectedItems.ssd?.[getSelectedCurrency()],
    selectedItems.cooler?.[getSelectedCurrency()],
    selectedItems.fan?.[getSelectedCurrency()],
    selectedItems.pcCase?.[getSelectedCurrency()],
  ]

  return calculateTotalNumber(compact(numberList))
}

export const getTotalPriceStr = (selectedItems: SelectedItemType) => {
  const totolPrice = getTotalPrice(selectedItems).toFixed(2).toString()
  return addCurrencySign(totolPrice)
}

const displayPriceLogic = (displayPrice: boolean, price: string) => {
  if (displayPrice) {
    return ` ${price}`
  } else {
    return ''
  }
}

export const getSelectItemListText = (
  selectedItems: SelectedItemType,
  displayPrice: boolean
) => {
  let resStr = ''
  let resLink = window.location.href+"?"

  if (selectedItems.cpu) {
    resStr += `${t(ProductEnum.CPU)}: ${
      selectedItems.cpu?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.cpu))}\n`
    resLink += `&${ProductEnum.CPU}=${selectedItems.cpu?.Name}`
  }
  if (selectedItems.motherboard) {
    resStr += `${t(ProductEnum.Motherboard)}: ${
      selectedItems.motherboard?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.motherboard))}\n`
    resLink += `&mb=${selectedItems.motherboard?.Name}`
  }
  if (selectedItems.gpu) {
    resStr += `${t(ProductEnum.GPU)}: ${
      selectedItems.gpu?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.gpu))}\n`
    resLink += `&gpu=${selectedItems.gpu?.Name}`
  }
  if (selectedItems.ram) {
    resStr += `${t(ProductEnum.RAM)}: ${
      selectedItems.ram?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.ram))}\n`
    resLink += `&${ProductEnum.RAM}=${selectedItems.ram?.Name}`
  }
  if (selectedItems.ssd) {
    resStr += `${t(ProductEnum.SSD)}: ${
      selectedItems.ssd?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.ssd))}\n`
    resLink += `&${ProductEnum.SSD}=${selectedItems.ssd?.Name}`
  }
  if (selectedItems.psu) {
    resStr += `${t(ProductEnum.PSU)}: ${
      selectedItems.psu?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.psu))}\n`
    resLink += `&${ProductEnum.PSU}=${selectedItems.psu?.Name}`
  }
  if (selectedItems.pcCase) {
    resStr += `${t(ProductEnum.ComputerCase)}: ${
      selectedItems.pcCase?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.pcCase))}\n`
    resLink += `&pcCase=${selectedItems.pcCase?.Name}`
  }
  if (selectedItems.cooler) {
    resStr += `${t(ProductEnum.Cooler)}: ${
      selectedItems.cooler?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.cooler))}\n`
    resLink += `&cooler=${selectedItems.cooler?.Name}`
  }

  if (displayPrice) {
    resStr += `${t('price')}: ${getTotalPriceStr(selectedItems)}`
  }

  if (resLink.includes("&")) {
    resStr += `\n\n${resLink}`
  }
  return resStr
}
