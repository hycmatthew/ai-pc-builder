import { t } from 'i18next'
import i18n from '../config/i18n'
import { RAMType, SSDType } from '../constant/objectTypes'
import { addCurrencySign } from './NumberHelper'

export const brandTranslationKey = (brand: string) => {
  const brandKey = brand.toLowerCase().replace('.', '').replace(' ', '-')
  // console.log(brandKey + '-' + t('brandKey'))
  return i18n.exists(brandKey) ? t(brandKey) : brand
}

export const generateItemName = (brand: string, name: string) => {
  const brandKey = brandTranslationKey(brand)
  return `${t(brandKey)} ${name}`
}

export const generateSSDName = (item: SSDType) => {
  const getSeries = item.brand || item.name
  return `${t(brandTranslationKey(item.brand))} ${item.name}`
}

export const generateRAMName = (item: RAMType) => {
  return `${t(brandTranslationKey(item.brand))} ${item.name}`
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

export const formatSSDCapacity = (capacity: number) => {
  // 处理特殊值
  if (capacity === 500) return '500GB'
  if (capacity === 1000) return '1TB'
  
  // 通用处理逻辑
  if (capacity >= 1000 && capacity % 1000 === 0) {
    return `${capacity / 1000}TB`
  }
  return `${capacity}GB`
}