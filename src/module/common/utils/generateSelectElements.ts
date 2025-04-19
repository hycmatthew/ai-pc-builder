import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  PSUType,
  CaseType,
  CoolerType,
  SSDType,
  FanType,
  OptionType,
} from '../../../constant/objectTypes'
import {
  generateItemName,
  generateRAMName,
  generateSSDName,
} from '../../../utils/LabelHelper'
import { convertLocalizedPrice, getLocalizedPriceNum } from '../../../utils/NumberHelper'
import { SelectedItemType } from '../../../store/rawDataReducer'
import {
  airCoolerIncompatible,
  cpuIncompatible,
  motherboardIncompatible,
} from './compatibleLogic'

export const generateCPUSelectElement = (
  list: CPUType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: CPUType) => getLocalizedPriceNum(item) != 0).map((item: CPUType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: selectedItems ? cpuIncompatible(item, selectedItems) : false,
    }
  })
  return tempMap
}

export const generateGPUSelectElement = (
  list: GPUType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: GPUType) => getLocalizedPriceNum(item) != 0).map((item: GPUType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: false,
    }
  })
  return tempMap
}

export const generateMotherboardSelectElement = (
  list: MotherboardType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: MotherboardType) => getLocalizedPriceNum(item) != 0).map((item: MotherboardType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: selectedItems
        ? motherboardIncompatible(item, selectedItems)
        : false,
    }
  })
  return tempMap
}

export const generateRAMSelectElement = (
  list: RAMType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: RAMType) => getLocalizedPriceNum(item) != 0).map((item: RAMType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateRAMName(item)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: false,
    }
  })
  return tempMap
}

export const generatePSUSelectElement = (
  list: PSUType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: PSUType) => getLocalizedPriceNum(item) != 0).map((item: PSUType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: false,
    }
  })
  return tempMap
}

export const generateCaseSelectElement = (
  list: CaseType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: CaseType) => getLocalizedPriceNum(item) != 0).map((item: CaseType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)
    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: false,
    }
  })
  return tempMap
}

export const generateAIOSelectElement = (
  list: CoolerType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: CoolerType) => getLocalizedPriceNum(item) != 0).map((item: CoolerType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)
    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: false,
    }
  })
  return tempMap
}

export const generateSSDSelectElement = (
  list: SSDType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.filter((item: SSDType) => getLocalizedPriceNum(item) != 0).map((item: SSDType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateSSDName(item)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: false,
    }
  })
  return tempMap
}

export const generateAirCoolerSelectElement = (
  list: FanType[],
  selectedItems?: SelectedItemType
): OptionType[] => {
  const tempMap = list.map((item: FanType) => {
    const price = convertLocalizedPrice(item)
    const itemLabel = generateItemName(item.brand, item.name)

    return {
      name: item.model,
      brand: item.brand,
      label: itemLabel,
      value: price,
      disabled: selectedItems
        ? airCoolerIncompatible(item, selectedItems)
        : false,
    }
  })
  return tempMap
}
