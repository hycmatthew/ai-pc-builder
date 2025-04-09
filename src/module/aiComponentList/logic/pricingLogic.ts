import { forOwn, toNumber } from 'lodash'
import i18n from '../../../config/i18n'
import {
  getCurrentPriceNum,
  getSelectedCurrency,
} from '../../../utils/NumberHelper'
import { SelectedItemType } from '../../../store/rawDataReducer'
import BuildConfig from '../constant/buildConfig'
import {
  CaseType,
  CoolerType,
  PSUType,
  SSDType,
} from '../../../constant/objectTypes'
import { LangEnum } from '../../../constant/supportedLang'

export const convertCurrency = (price: number) => {
  switch (i18n.language) {
    case LangEnum.zhTW:
      return price * BuildConfig.HKPricingFactor
    case LangEnum.zhCN:
      return price * BuildConfig.CNPricingFactor
    default:
      return price * BuildConfig.USPricingFactor
  }
}

export const getPricingFactor = (budget: number, factorList: number[]) => {
  const tempList = BuildConfig.PriceList
  const updatedBudget = convertCurrency(budget)
  let factor: number = factorList[0]

  factorList.forEach((element, index) => {
    if (updatedBudget < tempList[index]) {
      factor = element
    }
  })
  return factor
}

export const getBudgetPriceList = () => {
  const tempList = BuildConfig.PriceList
  switch (i18n.language) {
    case LangEnum.zhTW:
      return tempList
    case LangEnum.zhCN:
      return tempList.map((item) => {
        return item / convertCurrency(1)
      })
    default:
      return tempList.map((item) => {
        return item / convertCurrency(1)
      })
  }
}

export const getBudgetByPricingFactor = (
  budget: number,
  factorList: number[]
) => {
  return budget * getPricingFactor(budget, factorList)
}

export const isEnoughBudget = (
  budget: number,
  preSelectedItems: SelectedItemType,
  itemPrice: string
) => {
  let countBudget = budget
  forOwn(preSelectedItems, (item) => {
    countBudget -= item ? toNumber(item[getSelectedCurrency()]) : 0
  })

  const priceNum = toNumber(itemPrice)
  if (priceNum !== 0 && countBudget > priceNum) return true
  return false
}

// ====================================================================================================
// 新增默认组件价格估算
export const estimateDefaultPrice = (
  ssdList: SSDType[],
  caseList: CaseType[],
  psuList: PSUType[],
  coolerList: CoolerType[]
) => {
  const defaultPrices = {
    ssd: 0,
    psu: 0,
    pcCase: 0,
    cooler: 0,
  }

  // 估算SSD价格
  const SSDSuggestion = BuildConfig.SSDFactor.SSDSuggestion
  const suggestedSSDs = ssdList.filter((ssd) =>
    SSDSuggestion.some((name) => ssd.Name == name)
  )

  defaultPrices.ssd =
    ssdList.length == 1
      ? getCurrentPriceNum(ssdList[0])
      : suggestedSSDs.reduce((sum, ssd) => sum + getCurrentPriceNum(ssd), 0) /
        suggestedSSDs.length

  // 估算机箱价格
  const caseSuggestion = BuildConfig.CaseFactor.CaseSuggestion.ATX.concat(
    BuildConfig.CaseFactor.CaseSuggestion.mATX
  )
  const suggestedCases = caseList.filter((item) =>
    caseSuggestion.some((id) => item.Id == id)
  )
  defaultPrices.pcCase =
    caseList.length == 1
      ? getCurrentPriceNum(caseList[0])
      : suggestedCases.reduce((sum, c) => sum + getCurrentPriceNum(c), 0) /
        suggestedCases.length

  // 估算电源价格
  const psuSuggestion = BuildConfig.PSUFactor.PSUSuggestion
  const suggestedPSU = psuList.filter((item) =>
    psuSuggestion.some((id) => item.Id == id)
  )
  defaultPrices.psu =
    psuList.length == 1
      ? getCurrentPriceNum(psuList[0])
      : suggestedPSU.reduce((sum, item) => sum + getCurrentPriceNum(item), 0) /
        suggestedPSU.length

  // 估算散热器价格
  const coolerSuggestion = BuildConfig.CPUCoolerFactor.CPUCoolerSuggestion[200]
  const suggestedCooler = coolerList.filter((item) =>
    coolerSuggestion.some((name) => item.Name == name)
  )
  defaultPrices.cooler =
    coolerList.length == 1
      ? getCurrentPriceNum(coolerList[0])
      : suggestedCooler.reduce((sum, c) => sum + getCurrentPriceNum(c), 0) /
        suggestedCooler.length

  const sumPrices = (prices: { [key: string]: number }): number => {
    return Object.values(prices).reduce((acc, price) => acc + price, 0)
  }

  // Calculate the total
  console.log(defaultPrices)

  return sumPrices(defaultPrices)
}
