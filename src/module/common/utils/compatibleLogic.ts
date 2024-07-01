import {
  MotherboardType,
  RAMType,
  PSUType,
  CaseType,
  AirCoolerType,
  CPUType,
  GPUType,
} from '../../../constant/objectTypes'
import {
  motherboardIncompatibleWithCPU,
  ramIncompatibleWithCPU,
  ramIncompatibleWithMotherboard,
  psuPowerNotEnough,
  caseIncompatibleWithGPU,
  caseIncompatibleWithMotherboard,
  caseIncompatibleWithAIO,
  airCoolerIncompatibleWithCase,
} from '../../../logic/incompatibleLogic'
import { getTotalPower } from '../../../utils/NumberHelper'
import { SelectedItemType } from '../../store/rawDataReducer'

export const cpuIncompatible = (
  item: CPUType,
  selectedItems: SelectedItemType
) => {
  return motherboardIncompatibleWithCPU(selectedItems.motherboard, item)
}

export const motherboardIncompatible = (
  item: MotherboardType,
  selectedItems: SelectedItemType
) => {
  return motherboardIncompatibleWithCPU(item, selectedItems.cpu)
}

export const gpuIncompatible = (
  item: GPUType,
  selectedItems: SelectedItemType
) => {
  return caseIncompatibleWithGPU(selectedItems.pcCase, item)
}

export const ramIncompatible = (
  item: RAMType,
  selectedItems: SelectedItemType
) => {
  const sameChipset = ramIncompatibleWithCPU(item, selectedItems.cpu)
  const isMotherboardSupport = ramIncompatibleWithMotherboard(
    item,
    selectedItems.motherboard
  )
  return sameChipset || isMotherboardSupport
}

export const psuIncompatible = (
  item: PSUType,
  selectedItems: SelectedItemType
) => {
  return psuPowerNotEnough(item.watt, getTotalPower(selectedItems))
}

export const caseIncompatible = (
  item: CaseType,
  selectedItems: SelectedItemType
) => {
  const gpuLengthValid = caseIncompatibleWithGPU(item, selectedItems.gpu)
  const motherboardValid = caseIncompatibleWithMotherboard(
    item,
    selectedItems.motherboard
  )
  const aioValid = caseIncompatibleWithAIO(item, selectedItems.aio)
  return gpuLengthValid || motherboardValid || aioValid
}

export const airCoolerIncompatible = (
  item: AirCoolerType,
  selectedItems: SelectedItemType
) => {
  const coolerHeightValid = airCoolerIncompatibleWithCase(
    item,
    selectedItems.pcCase
  )
  return coolerHeightValid
}
