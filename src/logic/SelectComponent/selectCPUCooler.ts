import { CPUType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { getLocalizedPriceNum } from '../../utils/NumberHelper'
import { getBudgetPriceList } from '../../module/aiComponentList/logic/pricingLogic'

const getItemCPUCoolerBudget = (budget: number) => {
  const ratioList = [0.4, 0.35, 0.3, 0.25]
  const priceList = getBudgetPriceList()

  let cpuBudget = 0
  priceList.forEach((element, index) => {
    if (budget < element) {
      const setRatio = ratioList[index]
        ? ratioList[index]
        : ratioList[ratioList.length - 1]
      cpuBudget = budget * setRatio
    }
  })
  return cpuBudget
}

const selectCPUCoolerLogic = (buildLogic: BuildLogicState, cpuList: CPUType[]) => {
  const cpuBudget = getItemCPUCoolerBudget(buildLogic.budget)
  let selectedCPU: CPUType | null = null
  let currentScore = 0
  cpuList.forEach((item: CPUType) => {
    if (cpuBudget > getLocalizedPriceNum(item)) {
      if (item.MultiCoreScore + item.SingleCoreScore > currentScore) {
        selectedCPU = item
        currentScore = item.MultiCoreScore + item.SingleCoreScore
      }
    }
  })
  return selectedCPU
}

export default selectCPUCoolerLogic
