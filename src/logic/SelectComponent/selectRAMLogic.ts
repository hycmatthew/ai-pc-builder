import { toNumber } from 'lodash'
import { RAMType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { ramIncompatible } from '../../module/common/utils/compatibleLogic'
import { convertLocalizedPrice, getLocalizedPriceNum } from '../../utils/NumberHelper'
import { convertCurrency, getPricingFactor, isEnoughBudget } from '../../module/aiComponentList/logic/pricingLogic'
import { ramProfileIsNotMatchCPU } from '../CompatibleLogic/suggestionLogic'
import BuildConfig from '../../module/aiComponentList/constant/buildConfig'
import { ramPerformanceLogic } from '../performanceLogic'

const ramCapacityScore = (capacity: number) => {
  let score = capacity / 16
  if (capacity === 64) {
    score = 3
  }
  return score
}

const getItemRamScore = (item: RAMType, budget: number) => {
  const ratioList = BuildConfig.RAMFactor.RAMBudgetFactor
  const priceFactor = getPricingFactor(budget, ratioList)
  const performanceScore = ramPerformanceLogic(item) * ramCapacityScore(item.Capacity)
  return performanceScore / convertCurrency(getLocalizedPriceNum(item))
}

const ramFilterLogic = (
  item: RAMType,
  buildLogic: BuildLogicState
) => {
  const compatible = !ramIncompatible(item, buildLogic.preSelectedItem)
  const chipsetSuggestion = !ramProfileIsNotMatchCPU(
    item,
    buildLogic.preSelectedItem.cpu
  )
  const enoughBudget = isEnoughBudget(
    buildLogic.budget,
    buildLogic.preSelectedItem,
    convertLocalizedPrice(item)
  )
  return compatible && chipsetSuggestion && enoughBudget
}

const selectRAMLogic = (buildLogic: BuildLogicState, ramList: RAMType[]) => {
  let selectedRAM: RAMType | null = null
  let currentScore = 0

  const filteredList = ramList.filter((item) => {
    return ramFilterLogic(item, buildLogic)
  })

  filteredList.forEach((item: RAMType) => {
    const tempScore = getItemRamScore(item, buildLogic.budget)
    if (tempScore > currentScore) {
      selectedRAM = item
      currentScore = tempScore
    }
  })
  return selectedRAM
}

export default selectRAMLogic
