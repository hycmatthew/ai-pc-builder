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

export const getSelectItemListText = (selectedItems: SelectedItemType) => {
  let resStr = ''

  if (selectedItems.cpu) {
    resStr += `${t(ProductEnum.CPU)}: ${
      selectedItems.cpu?.Name
    } ${getCurrentPriceWithSign(selectedItems.cpu)}\n`
  }
  if (selectedItems.motherboard) {
    resStr += `${t(ProductEnum.Motherboard)}: ${
      selectedItems.motherboard?.Name
    } ${getCurrentPriceWithSign(selectedItems.motherboard)}\n`
  }
  if (selectedItems.gpu) {
    resStr += `${t(ProductEnum.GPU)}: ${
      selectedItems.gpu?.Name
    } ${getCurrentPriceWithSign(selectedItems.gpu)}\n`
  }
  if (selectedItems.ram) {
    resStr += `${t(ProductEnum.RAM)}: ${
      selectedItems.ram?.Name
    } ${getCurrentPriceWithSign(selectedItems.ram)}\n`
  }
  if (selectedItems.ssd) {
    resStr += `${t(ProductEnum.SSD)}: ${
      selectedItems.ssd?.Name
    } ${getCurrentPriceWithSign(selectedItems.ssd)}\n`
  }
  if (selectedItems.psu) {
    resStr += `${t(ProductEnum.PSU)}: ${
      selectedItems.psu?.Name
    } ${getCurrentPriceWithSign(selectedItems.psu)}\n`
  }
  if (selectedItems.pcCase) {
    resStr += `${t(ProductEnum.ComputerCase)}: ${
      selectedItems.pcCase?.Name
    } ${getCurrentPriceWithSign(selectedItems.pcCase)}\n`
  }
  if (selectedItems.aio) {
    resStr += `${t(ProductEnum.AIO)}: ${
      selectedItems.aio?.Name
    } ${getCurrentPriceWithSign(selectedItems.aio)}\n`
  }

  resStr += `${t('price')}: ${getTotalPriceStr(selectedItems)}`

  return resStr
}
