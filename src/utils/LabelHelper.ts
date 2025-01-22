import { t } from 'i18next'
import i18n from '../config/i18n'
import { RAMType, SSDType } from '../constant/objectTypes'
import { addCurrencySign } from './NumberHelper'

export const brandTranslationKey = (brand: string) => {
  const brandKey = brand.toLowerCase().replace('.', '').replace(' ', '-')
  return i18n.exists(brandKey) ? brandKey : brand
}

export const generateItemName = (brand: string, name: string) => {
  const brandKey = brandTranslationKey(brand)
  return `${t(brandKey)} ${name}`
}

export const generateSSDName = (item: SSDType) => {
  const getSeries = item.Brand || item.Name
  return `${t(brandTranslationKey(item.Brand))} ${item.Name}`
}

export const generateRAMName = (item: RAMType) => {
  return `${t(brandTranslationKey(item.Brand))} ${item.Name}`
}

export const priceLabelHandler = (price: string) => {
  return Number(price) === 0 ? '-' : addCurrencySign(price)
}

export const lengthLabelHandler = (length: number) => {
  return `${length}mm`
}

export const diskSpeedLabelHandler = (speed: number) => {
  return `${speed} MB/s`
}
