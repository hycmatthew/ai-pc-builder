import { CPUType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { convertLocalizedPrice, getLocalizedPriceNum } from '../../utils/NumberHelper'
import { convertCurrency, getPricingFactor, isEnoughBudget } from '../../module/aiComponentList/logic/pricingLogic'
import BuildConfig from '../../module/aiComponentList/constant/buildConfig'
import { cpuIncompatible } from '../../module/common/utils/compatibleLogic'
import { motherboardChipsetSuggestion, motherboardOverclockSuggestion } from '../CompatibleLogic/suggestionLogic'

const cpuHaveInternalGPU = (cpu: CPUType) => {
  if (cpu) {
    return cpu.GPU !== ''
  }
  return false
}

const cpuPricingLogic = (item: CPUType, budget: number) => {
  const ratioList = BuildConfig.CPUFactor.CPUBudgetFactor
  const priceFactor = getPricingFactor(budget, ratioList)
  return (budget * priceFactor) > convertCurrency(getLocalizedPriceNum(item))
}

const countCPUScore = (item: CPUType) => {
  const singleScore = item.SingleCoreScore * BuildConfig.CPUFactor.SingleCoreMultiply
  const multiScore = item.MultiCoreScore * BuildConfig.CPUFactor.MultiCoreMultiply
  const internalScore = cpuHaveInternalGPU(item) ? 2000 : 0
  return singleScore + multiScore + internalScore
}

const cpuFilterLogic = (
  item: CPUType,
  buildLogic: BuildLogicState
) => {
  const compatible = !cpuIncompatible(item, buildLogic.preSelectedItem)
  const chipsetSuggestion = !motherboardChipsetSuggestion(
    item,
    buildLogic.preSelectedItem.motherboard,
  )
  const overclockSuggestion = !motherboardOverclockSuggestion(
    item,
    buildLogic.preSelectedItem.motherboard,
  )
  const enoughBudget = isEnoughBudget(
    buildLogic.budget,
    buildLogic.preSelectedItem,
    convertLocalizedPrice(item)
  )

  const cpuBudget = cpuPricingLogic(item, buildLogic.budget)

  return compatible && chipsetSuggestion && overclockSuggestion && enoughBudget && cpuBudget
}

const selectCPULogic = (buildLogic: BuildLogicState, cpuList: CPUType[]) => {
  let selectedCPU: CPUType | null = null
  let currentScore = 0

  const filteredList = cpuList.filter((item) => {
    return cpuFilterLogic(item, buildLogic)
  })

  filteredList.forEach((item: CPUType) => {
    if (countCPUScore(item) > currentScore) {
      selectedCPU = item
      currentScore = countCPUScore(item)
    }
  })
  return selectedCPU
}

export default selectCPULogic
