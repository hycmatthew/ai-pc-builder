import { t } from 'i18next'
import { SelectedItemType } from '../store/rawDataReducer'
import ProductEnum from '../constant/ProductEnum'
import {
  getCurrentPriceWithSign,
  getTotalPriceStr,
} from './NumberHelper'
import i18n from '../config/i18n'
import { LangEnum } from '../constant/supportedLang'

export const getCurrentSaleLink = (item: any) => {
  const linkMap: Record<LangEnum, string> = {
    [LangEnum.zhTW]: 'LinkHK',
    [LangEnum.zhCN]: 'LinkCN',
    [LangEnum.en]: 'LinkUS'
  }
  return item[linkMap[i18n.language as LangEnum]] || item.LinkUS
}

// ==================== 文字生成邏輯 ====================
type ProductComponent = keyof SelectedItemType

const componentConfig: Array<{
  key: ProductComponent
  productEnum: ProductEnum
  paramName?: string  // 用於特殊URL參數名稱
}> = [
  { key: 'cpu', productEnum: ProductEnum.CPU },
  { key: 'motherboard', productEnum: ProductEnum.Motherboard, paramName: 'mb' },
  { key: 'gpu', productEnum: ProductEnum.GPU },
  { key: 'ram', productEnum: ProductEnum.RAM },
  { key: 'ssd', productEnum: ProductEnum.SSD },
  { key: 'psu', productEnum: ProductEnum.PSU },
  { key: 'pcCase', productEnum: ProductEnum.ComputerCase, paramName: 'pcCase' },
  { key: 'cooler', productEnum: ProductEnum.Cooler }
]

const buildComponentLine = (
  component: SelectedItemType[ProductComponent],
  productEnum: ProductEnum,
  displayPrice: boolean
): string => {
  if (!component) return ''
  const pricePart = displayPrice ? ` ${getCurrentPriceWithSign(component)}` : ''
  return `${t(productEnum)}: ${component.name}${pricePart}\n`
}

export const getSelectItemListText = (
  selectedItems: SelectedItemType,
  displayPrice: boolean
): string => {
  const lines: string[] = []
  const searchParams = new URLSearchParams()

  componentConfig.forEach(({ key, productEnum, paramName }) => {
    const component = selectedItems[key]
    if (component) {
      lines.push(buildComponentLine(component, productEnum, displayPrice))
      searchParams.append(paramName || productEnum.toLowerCase(), component.id)
    }
  })

  if (displayPrice) {
    lines.push(`${t('price')}: ${getTotalPriceStr(selectedItems)}`)
  }

  const baseUrl = `${window.location.href.split('?')[0]}?`
  const queryString = searchParams.toString()
  
  return [
    lines.join(''),
    ...(queryString ? [`\n\n${baseUrl}${queryString}`] : [])
  ].join('')
}