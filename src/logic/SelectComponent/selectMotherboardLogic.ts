import { MotherboardType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { motherboardIncompatible } from '../../module/common/utils/compatibleLogic'
import { convertLocalizedPrice, getLocalizedPriceNum } from '../../utils/NumberHelper'
import {
  convertCurrency,
  isEnoughBudget,
} from '../../module/aiComponentList/logic/pricingLogic'
import {
  motherboardChipsetSuggestion,
  motherboardOverclockSuggestion,
} from '../CompatibleLogic/suggestionLogic'

const getItemMotherboardScore = (
  motherboard: MotherboardType,
  budget: number
) => {
  const sizeScore = motherboard.FormFactor === 'ATX' ? 300 : 0
  const budgetScore = budget - convertCurrency(getLocalizedPriceNum(motherboard))
  return sizeScore + budgetScore
}

const motherboardFilterLogic = (
  item: MotherboardType,
  buildLogic: BuildLogicState
) => {
  const compatible = !motherboardIncompatible(item, buildLogic.preSelectedItem)
  const chipsetSuggestion = !motherboardChipsetSuggestion(
    buildLogic.preSelectedItem.cpu,
    item,
  )
  const overclockSuggestion = !motherboardOverclockSuggestion(
    buildLogic.preSelectedItem.cpu,
    item
  )
  const enoughBudget = isEnoughBudget(
    buildLogic.budget,
    buildLogic.preSelectedItem,
    convertLocalizedPrice(item)
  )
  return compatible && chipsetSuggestion && overclockSuggestion && enoughBudget
}

const selectMotherboardLogic = (
  buildLogic: BuildLogicState,
  motherboardList: MotherboardType[]
) => {
  console.log(buildLogic)
  let selectedMotherboard: MotherboardType | null = null
  let currentScore = 0

  const filteredList = motherboardList.filter((item) => {
    return motherboardFilterLogic(item, buildLogic)
  })

  filteredList.forEach((item: MotherboardType) => {
    const tempScore = getItemMotherboardScore(item, buildLogic.budget)
    if (tempScore > currentScore) {
      selectedMotherboard = item
      currentScore = tempScore
    }
  })
  return selectedMotherboard
}

export default selectMotherboardLogic
