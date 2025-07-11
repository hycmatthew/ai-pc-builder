import {
  MotherboardType,
  RAMType,
  PSUType,
  CaseType,
  CPUType,
  GPUType,
} from '../../../constant/objectTypes'
import {
  cpuIncompatibleWithMotherboard,
  motherboardIncompatibleWithRam,
  psuPowerNotEnough,
  gpuIncompatibleWithCase,
  motherboardIncompatibleWithCase,
  aioIncompatibleWithCase,
} from '../../../logic/CompatibleLogic/incompatibleLogic'
import { getTotalPower } from '../../../utils/NumberHelper'
import { SelectedItemType } from '../../../store/rawDataReducer'
import { ramIncompatibleWithCPU } from '../../../logic/CompatibleLogic/suggestionLogic'

export const cpuIncompatible = (
  item: CPUType,
  selectedItems: SelectedItemType
) => {
  return cpuIncompatibleWithMotherboard(item, selectedItems.motherboard)
}

export const motherboardIncompatible = (
  item: MotherboardType,
  selectedItems: SelectedItemType
) => {
  return cpuIncompatibleWithMotherboard(selectedItems.cpu, item)
}

export const gpuIncompatible = (
  item: GPUType,
  selectedItems: SelectedItemType
) => {
  return gpuIncompatibleWithCase(selectedItems.pcCase, item)
}

export const ramIncompatible = (
  item: RAMType,
  selectedItems: SelectedItemType
) => {
  const sameChipset = ramIncompatibleWithCPU(item, selectedItems.cpu)
  const isMotherboardSupport = motherboardIncompatibleWithRam(
    selectedItems.motherboard,
    item
  )
  return sameChipset || isMotherboardSupport
}

export const psuIncompatible = (
  item: PSUType,
  selectedItems: SelectedItemType
) => {
  return psuPowerNotEnough(item.wattage, getTotalPower(selectedItems))
}

export const caseIncompatible = (
  item: CaseType,
  selectedItems: SelectedItemType
) => {
  const gpuLengthValid = gpuIncompatibleWithCase(item, selectedItems.gpu)
  const motherboardValid = motherboardIncompatibleWithCase(
    item,
    selectedItems.motherboard
  )
  const aioValid = aioIncompatibleWithCase(selectedItems.cooler, item)
  return gpuLengthValid || motherboardValid || aioValid
}
