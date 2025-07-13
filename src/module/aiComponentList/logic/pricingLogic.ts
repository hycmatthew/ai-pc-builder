import { forOwn, toNumber } from 'lodash'
import i18n from '../../../config/i18n'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'
import { SelectedItemType } from '../../../store/rawDataReducer'
import BuildConfig from '../constant/buildConfig'
import { CaseType } from '../../../constant/objectTypes'
import { LangEnum } from '../../../constant/supportedLang'
import { calculateBudgetFactor } from './scoreLogic'
import { calculateIdealCoolerPrice } from './selectCooler'

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
export const estimateDefaultPrice = (caseList: CaseType[], budget: number) => {
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
      : getLocalizedPriceNum(suggestedCases[0])

  // 估算电源价格
  const estimatePower = calculateBudgetFactor(budget, 650, 1200)
  defaultPrices.psu = estimatePower * BuildConfig.PSUFactor.PSUWattBudgetFactor

  // 估算散热器价格
  const estimateCPUPrice = calculateBudgetFactor(budget, 120, 500)
  defaultPrices.cooler = calculateIdealCoolerPrice(estimateCPUPrice, budget)
  /*
  // 估算ssd价格
  const getSSDPriceRange = (
    ssds: SSDType[],
    targetCapacity: number
  ): { min: number; max: number } => {
    // 1. 过滤出指定容量的有效SSD
    const validSSDs = ssds
      .filter((ssd) => ssd.capacity === targetCapacity)
      .map((ssd) => getLocalizedPriceNum(ssd))
      .filter((price) => price > 0)
    // 如果没有有效SSD，返回0
    if (validSSDs.length === 0) {
      return { min: 0, max: 0 }
    }
    // 2. 对价格进行排序（从小到大）
    const sortedPrices = [...validSSDs].sort((a, b) => a - b)
    // 3. 计算20%分界点
    const count20Percent = Math.max(1, Math.round(sortedPrices.length * 0.2))
    // 4. 获取最便宜的20% SSD价格
    const cheapest20Percent = sortedPrices.slice(0, count20Percent)
    const minAvg =
      cheapest20Percent.reduce((sum, price) => sum + price, 0) /
      cheapest20Percent.length

    // 5. 获取最贵的20% SSD价格
    const expensive20Percent = sortedPrices.slice(-count20Percent)
    const maxAvg =
      expensive20Percent.reduce((sum, price) => sum + price, 0) /
      expensive20Percent.length

    return {
      min: minAvg,
      max: maxAvg,
    }
  }

  const ssdPriceRange = getSSDPriceRange(ssdList, capacity)
  defaultPrices.ssd = calculateBudgetFactor(
    budget,
    ssdPriceRange.min,
    ssdPriceRange.max
  )
  console.log('ssd price: ', defaultPrices.ssd)
  */
  const sumPrices = (prices: { [key: string]: number }): number => {
    return Object.values(prices).reduce((acc, price) => acc + price, 0)
  }

  return sumPrices(defaultPrices)
}
