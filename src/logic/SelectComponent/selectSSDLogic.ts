import { toNumber } from 'lodash'
import { SSDType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { convertLocalizedPrice, getLocalizedPriceNum } from '../../utils/NumberHelper'
import { convertCurrency, getPricingFactor, isEnoughBudget } from '../../module/aiComponentList/logic/pricingLogic'
import BuildConfig from '../../module/aiComponentList/constant/buildConfig'

const getItemSSDScore = (item: SSDType, budget: number) => {
  const ratioList = BuildConfig.SSDFactor.SSDPriceFactor
  const priceFactor = getPricingFactor(budget, ratioList)
  const pricingScore = convertCurrency(getLocalizedPriceNum(item)) * priceFactor

  return item + pricingScore
}

const ssdFilterLogic = (
  item: SSDType,
  buildLogic: BuildLogicState
) => {
  const capacityFilter = item.Capacity.toUpperCase().includes('1TB')
  const enoughBudget = isEnoughBudget(
    buildLogic.budget,
    buildLogic.preSelectedItem,
    convertLocalizedPrice(item)
  )
  return capacityFilter && enoughBudget
}

const selectSSDLogic = (buildLogic: BuildLogicState, ssdist: SSDType[]) => {
  let selectedSSD: SSDType | null = null
  let currentScore = 0

  const filteredSSDList = ssdist.filter((item) => {
    return ssdFilterLogic(item, buildLogic)
  })

  filteredSSDList.forEach((item: SSDType) => {
    const tempScore = getItemSSDScore(item, buildLogic.budget)
    if (tempScore > currentScore) {
      selectedSSD = item
      currentScore = tempScore
    }
  })
  return selectedSSD
}

export default selectSSDLogic
