import { toNumber } from 'lodash'
import { CPUType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { getSelectedCurrency } from '../../utils/NumberHelper'
import { convertCurrency, getPricingFactor, isEnoughBudget } from '../../module/aiComponentList/logic/pricingLogic'
import buildConfig from '../../module/aiComponentList/data/buildConfig'
import { cpuIncompatible } from '../../module/common/utils/compatibleLogic'
import { motherboardChipsetSuggestion, motherboardOverclockSuggestion } from '../suggestionLogic'

const cpuHaveInternalGPU = (cpu: CPUType) => {
  if (cpu) {
    return cpu.gpu !== ''
  }
  return false
}

const cpuPricingLogic = (item: CPUType, budget: number) => {
  const ratioList = buildConfig.cpuFactor.CPUBudgetGFactor
  const priceFactor = getPricingFactor(budget, ratioList)
  return (budget * priceFactor) > convertCurrency(toNumber(item[getSelectedCurrency()]))
}

const countCPUScore = (item: CPUType) => {
  const singleScore = item.singleCoreScore * buildConfig.cpuFactor.singleCoreMultiply
  const multiScore = item.multiCoreScore * buildConfig.cpuFactor.multiCoreMultiply
  const internalScore = cpuHaveInternalGPU(item) ? 2000 : 0
  return singleScore + multiScore + internalScore
}

const cpuFilterLogic = (
  item: CPUType,
  buildLogic: BuildLogicState
) => {
  const compatible = !cpuIncompatible(item, buildLogic.preSelectedItem)
  const chipsetSuggestion = !motherboardChipsetSuggestion(
    buildLogic.preSelectedItem.motherboard,
    item
  )
  const overclockSuggestion = !motherboardOverclockSuggestion(
    buildLogic.preSelectedItem.motherboard,
    item
  )
  const enoughBudget = isEnoughBudget(
    buildLogic.budget,
    buildLogic.preSelectedItem,
    item[getSelectedCurrency()]
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
