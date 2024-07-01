import { toNumber } from 'lodash'
import { SSDType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { getSelectedCurrency } from '../../utils/NumberHelper'
import { convertCurrency, getPricingFactor, isEnoughBudget } from '../../module/aiComponentList/logic/pricingLogic'
import buildConfig from '../../module/aiComponentList/data/buildConfig'

const getItemSSDScore = (item: SSDType, budget: number) => {
  const ratioList = buildConfig.ssdFactor.SSDPriceFactor
  const priceFactor = getPricingFactor(budget, ratioList)
  const pricingScore = convertCurrency(toNumber(item[getSelectedCurrency()])) * priceFactor

  return item.score + pricingScore
}

const ssdFilterLogic = (
  item: SSDType,
  buildLogic: BuildLogicState
) => {
  const capacityFilter = item.capacity.toUpperCase().includes('1TB')
  const enoughBudget = isEnoughBudget(
    buildLogic.budget,
    buildLogic.preSelectedItem,
    item[getSelectedCurrency()]
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
