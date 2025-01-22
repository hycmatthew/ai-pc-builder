import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  PSUType,
  CaseType,
  AIOType,
  SSDType,
  AirCoolerType,
  OptionType,
} from '../../../constant/objectTypes'
import {
  generateItemName,
  generateRAMName,
  generateSSDName,
} from '../../../utils/LabelHelper'
import { getCurrentPrice } from '../../../utils/NumberHelper'
import { SelectedItemType } from '../../../store/rawDataReducer'
import {
  airCoolerIncompatible,
  caseIncompatible,
  cpuIncompatible,
  motherboardIncompatible,
  psuIncompatible,
  ramIncompatible,
} from './compatibleLogic'

/*  sort Logic tbc
enum SortBy {
  model = 'model',
  speed = 'speed',
  gpu = 'gpu',
  chipset = 'chipset',
  label = 'label',
}

const listSortingLogic = (arr: OptionType[], sortBy: SortBy) => {
  return arr
    .filter((item: any) => item.value !== '0.00')
    .sort((a, b) => b.brand.concat(b[sortBy]).localeCompare(a.brand.concat(a[sortBy])))
}
*/

export const generateCPUSelectElement = (
  list: CPUType[],
  selectedItems?: SelectedItemType
) : OptionType[] => {
  const tempMap = list.map((item: CPUType) => {
    const price = getCurrentPrice(item)
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
) : OptionType[] => {
  const tempMap = list.map((item: GPUType) => {
    const price = getCurrentPrice(item)
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
) : OptionType[] => {
  const tempMap = list.map((item: MotherboardType) => {
    const price = getCurrentPrice(item)
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
) : OptionType[] => {
  const tempMap = list.map((item: RAMType) => {
    const price = getCurrentPrice(item)
    const itemLabel = generateRAMName(item)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: selectedItems ? ramIncompatible(item, selectedItems) : false,
    }
  })
  return tempMap
}

export const generatePSUSelectElement = (
  list: PSUType[],
  selectedItems?: SelectedItemType
) : OptionType[] => {
  const tempMap = list.map((item: PSUType) => {
    const price = getCurrentPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)

    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: selectedItems ? psuIncompatible(item, selectedItems) : false,
    }
  })
  return tempMap
}

export const generateCaseSelectElement = (
  list: CaseType[],
  selectedItems?: SelectedItemType
) : OptionType[] => {
  const tempMap = list.map((item: CaseType) => {
    const price = getCurrentPrice(item)
    const itemLabel = generateItemName(item.Brand, item.Name)
    return {
      name: item.Name,
      brand: item.Brand,
      label: itemLabel,
      value: price,
      disabled: selectedItems ? caseIncompatible(item, selectedItems) : false,
    }
  })
  return tempMap
}

export const generateAIOSelectElement = (
  list: AIOType[],
  selectedItems?: SelectedItemType
) : OptionType[] => {
  const tempMap = list.map((item: AIOType) => {
    const price = getCurrentPrice(item)
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
) : OptionType[] => {
  const tempMap = list.map((item: SSDType) => {
    const price = getCurrentPrice(item)
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
  list: AirCoolerType[],
  selectedItems?: SelectedItemType
) : OptionType[]  => {
  const tempMap = list.map((item: AirCoolerType) => {
    const price = getCurrentPrice(item)
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
