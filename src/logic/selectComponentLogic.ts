import { compact, sum, toNumber } from 'lodash'
import i18n from '../config/i18n'
import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
} from '../constant/objectTypes'
import { BuildLogicState } from '../module/aiComponentList/store/aiLogicReducer'
import { ramIncompatible } from '../module/common/utils/compatibleLogic'
import {
  calculateTotalNumber,
  convertLocalizedPrice,
  getLocalizedPriceNum,
} from '../utils/NumberHelper'
import { ramPerformanceLogic } from './performanceLogic'

export const selectComponentLogic = (budget: number, type: number) => {
  return budget < 10000 ? budget * 0.25 : budget * 0.2
}

const calculateCurrentBudget = (buildLogic: BuildLogicState) => {
  const dataList = [
    convertLocalizedPrice(buildLogic.preSelectedItem.cpu),
    convertLocalizedPrice(buildLogic.preSelectedItem.gpu),
    convertLocalizedPrice(buildLogic.preSelectedItem.motherboard),
    convertLocalizedPrice(buildLogic.preSelectedItem.ram),
    convertLocalizedPrice(buildLogic.preSelectedItem.ssd),
    convertLocalizedPrice(buildLogic.preSelectedItem.psu),
    convertLocalizedPrice(buildLogic.preSelectedItem.cooler),
    convertLocalizedPrice(buildLogic.preSelectedItem.pcCase),
    //convertLocalizedPrice(buildLogic.preSelectedItem.airCooler),
  ]
  return calculateTotalNumber(compact(dataList))
}

export const selectRAMLogic = (
  buildLogic: BuildLogicState,
  ramList: RAMType[]
) => {
  let selectedRAM: RAMType | null = null
  let currentScore = 0
  ramList.forEach((item: RAMType) => {
    const ramValid = ramIncompatible(item, buildLogic.preSelectedItem)
    if (
      !ramValid &&
      buildLogic.budget > getLocalizedPriceNum(item)
    ) {
      const performance = ramPerformanceLogic(item)
      selectedRAM = item
      currentScore = performance
    }
  })
  return selectedRAM
}
