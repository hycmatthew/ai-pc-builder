import { forOwn, toNumber } from 'lodash'
import i18n from '../../../config/i18n'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'
import { SelectedItemType } from '../../../store/rawDataReducer'
import BuildConfig from '../constant/buildConfig'
import { CaseType, CoolerType, PSUType } from '../../../constant/objectTypes'
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

export const isEnoughBudget = (
  budget: number,
  preSelectedItems: SelectedItemType,
  itemPrice: string
) => {
  let countBudget = budget
  forOwn(preSelectedItems, (item) => {
    countBudget -= item ? getLocalizedPriceNum(item) : 0
  })

  const priceNum = toNumber(itemPrice)
  if (priceNum !== 0 && countBudget > priceNum) return true
  return false
}

// ====================================================================================================
// 新增默认组件价格估算
export const estimateDefaultPrice = (
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

  // 估算机箱价格
  const caseSuggestion = BuildConfig.CaseFactor.CaseSuggestion.ATX.concat(
    BuildConfig.CaseFactor.CaseSuggestion.mATX
  )
  const suggestedCases = caseList.filter((item) =>
    caseSuggestion.some((id) => item.id == id)
  )
  defaultPrices.pcCase =
    caseList.length == 1
      ? getLocalizedPriceNum(caseList[0])
      : suggestedCases.reduce((sum, c) => sum + getLocalizedPriceNum(c), 0) /
        suggestedCases.length

  // 估算电源价格
  const psuSuggestion = BuildConfig.PSUFactor.PSUSuggestion
  const suggestedPSU = psuList.filter((item) =>
    psuSuggestion.some((id) => item.id == id)
  )
  defaultPrices.psu =
    psuList.length == 1
      ? getLocalizedPriceNum(psuList[0])
      : suggestedPSU.reduce(
          (sum, item) => sum + getLocalizedPriceNum(item),
          0
        ) / suggestedPSU.length

  // 估算散热器价格
  const coolerSuggestion = BuildConfig.CPUCoolerFactor.AirCoolerSuggestion
  const suggestedCooler = coolerList.filter((item) =>
    coolerSuggestion.some((id) => item.id == id)
  )
  defaultPrices.cooler =
    coolerList.length == 1
      ? getLocalizedPriceNum(coolerList[0])
      : suggestedCooler.reduce((sum, c) => sum + getLocalizedPriceNum(c), 0) /
        suggestedCooler.length

  const sumPrices = (prices: { [key: string]: number }): number => {
    return Object.values(prices).reduce((acc, price) => acc + price, 0)
  }

  // Calculate the total
  console.log('defaultPrices: ', defaultPrices)

  return sumPrices(defaultPrices)
}
