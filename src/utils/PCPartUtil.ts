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
    selectedItems.aio?.[getSelectedCurrency()],
    selectedItems.airCooler?.[getSelectedCurrency()],
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

  if (selectedItems.cpu) {
    resStr += `${t(ProductEnum.CPU)}: ${
      selectedItems.cpu?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.cpu))}\n`
  }
  if (selectedItems.motherboard) {
    resStr += `${t(ProductEnum.Motherboard)}: ${
      selectedItems.motherboard?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.motherboard))}\n`
  }
  if (selectedItems.gpu) {
    resStr += `${t(ProductEnum.GPU)}: ${
      selectedItems.gpu?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.gpu))}\n`
  }
  if (selectedItems.ram) {
    resStr += `${t(ProductEnum.RAM)}: ${
      selectedItems.ram?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.ram))}\n`
  }
  if (selectedItems.ssd) {
    resStr += `${t(ProductEnum.SSD)}: ${
      selectedItems.ssd?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.ssd))}\n`
  }
  if (selectedItems.psu) {
    resStr += `${t(ProductEnum.PSU)}: ${
      selectedItems.psu?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.psu))}\n`
  }
  if (selectedItems.pcCase) {
    resStr += `${t(ProductEnum.ComputerCase)}: ${
      selectedItems.pcCase?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.pcCase))}\n`
  }
  if (selectedItems.aio) {
    resStr += `${t(ProductEnum.AIO)}: ${
      selectedItems.aio?.Name
    }${displayPriceLogic(displayPrice, getCurrentPriceWithSign(selectedItems.aio))}\n`
  }

  if (displayPrice) {
    resStr += `${t('price')}: ${getTotalPriceStr(selectedItems)}`
  }

  return resStr
}
