import { toNumber } from 'lodash'
import { PSUType } from '../../constant/objectTypes'
import { BuildLogicState } from '../../module/aiComponentList/store/aiLogicReducer'
import { psuIncompatible } from '../../module/common/utils/compatibleLogic'
import { getSelectedCurrency } from '../../utils/NumberHelper'

const selectPSULogic = (buildLogic: BuildLogicState, psuList: PSUType[]) => {
  let selectedpsu: PSUType | null = null
  let currentPrice = 10000
  psuList.forEach((item: PSUType) => {
    if (psuIncompatible(item, buildLogic.preSelectedItem)) {
      if (currentPrice > toNumber(item[getSelectedCurrency()])) {
        selectedpsu = item
        currentPrice = toNumber(item[getSelectedCurrency()])
      }
    }
  })
  return selectedpsu
}

export default selectPSULogic
