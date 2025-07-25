import { t } from 'i18next'
import i18n from '../config/i18n'
import { RAMType, SSDType } from '../constant/objectTypes'
import { addCurrencySign } from './NumberHelper'

export const handleYesNoFromNum = (type: number) => {
  return type ? t('yes') : t('no')
}

export const brandTranslationKey = (brand: string, lang?: string) => {
  const brandKey = `brand-${brand.toLowerCase()}`
  // 如果有指定语言
  if (lang) {
    // 创建指定语言的翻译函数实例
    const tWithLang = i18n.getFixedT(lang)
    return i18n.exists(brandKey) ? tWithLang(brandKey) : brand
  }

  // 默认行为（使用当前语言）
  return i18n.exists(brandKey) ? t(brandKey) : brand
}
export const generateItemName = (brand: string, name: string) => {
  const brandKey = brandTranslationKey(brand)
  return `${t(brandKey)} ${name}`
}

export const generateSSDName = (item: SSDType) => {
  // const getSeries = item.brand || item.name
  return `${brandTranslationKey(item.brand)} ${item.name}`
}

export const generateRAMName = (item: RAMType) => {
  return `${brandTranslationKey(item.brand)} ${item.name}`
}

export const priceLabelHandler = (price: string) => {
  return Number(price) === 0 ? '-' : addCurrencySign(price)
}

export const powerLabelHandler = (watt: number) => {
  return watt > 0 ? `${watt} W` : '-'
}

export const lengthLabelHandler = (length: number) => {
  return `${length}mm`
}

export const diskSpeedLabelHandler = (speed: number) => {
  return `${speed} MB/s`
}

export const formatNormalCapacity = (capacity: number) => {
  return `${capacity}GB`
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
