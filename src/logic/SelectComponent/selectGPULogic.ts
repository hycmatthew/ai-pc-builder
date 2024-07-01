import { toNumber } from 'lodash'
import i18n from '../../config/i18n'
import { GPUType } from '../../constant/objectTypes'
import { isEnoughBudget } from '../../module/aiComponentList/logic/pricingLogic'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { gpuIncompatible } from '../../module/common/utils/compatibleLogic'
import { getSelectedCurrency } from '../../utils/NumberHelper'

const countGPUScore = (item: GPUType, buildLogic: BuildLogicState) => {
  return item.firestrikeScore + item.timespyScore
}

const gpuFilterLogic = (
  item: GPUType,
  buildLogic: BuildLogicState
) => {
  const compatible = !gpuIncompatible(item, buildLogic.preSelectedItem)
  const enoughBudget = isEnoughBudget(
    buildLogic.budget,
    buildLogic.preSelectedItem,
    item[getSelectedCurrency()]
  )
  return compatible && enoughBudget
}

const selectGPULogic = (buildLogic: BuildLogicState, gpuList: GPUType[]) => {
  let selectedGPU: GPUType | null = null
  let currentScore = 0

  const filteredList = gpuList.filter((item) => {
    return gpuFilterLogic(item, buildLogic)
  })

  filteredList.forEach((item: GPUType) => {
    const tempScore = countGPUScore(item, buildLogic)
    if (tempScore > currentScore) {
      selectedGPU = item
      currentScore = tempScore
    }
  })
  return selectedGPU
}

export default selectGPULogic
