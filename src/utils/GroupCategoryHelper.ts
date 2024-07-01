import {
  AIOType,
  AirCoolerType,
  CaseType,
  CPUType,
  GPUType,
  MotherboardType,
  PSUType,
  RAMType,
  SSDType,
} from '../constant/objectTypes'
import { brandTranslationKey } from './LabelHelper'

export const getCPUBrand = (items: CPUType[]) => {
  const options = [...new Set(items.map((item: CPUType) => item.brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getGPUBrand = (items: GPUType[]) => {
  const options = [...new Set(items.map((item: GPUType) => item.brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getGPUManufacturer = (items: GPUType[]) => {
  const options = [
    ...new Set(items.map((item: GPUType) => item.manufacturer)),
  ].map((item) => {
    return {
      label: brandTranslationKey(item),
      value: item,
    }
  })
  return options
}

export const getGPUType = (items: GPUType[]) => {
  const options = [...new Set(items.map((item: GPUType) => item.gpu))].map(
    (item) => {
      return {
        label: item,
        value: item,
      }
    }
  )
  return options
}

export const getMotherboardBrand = (items: MotherboardType[]) => {
  const options = [
    ...new Set(items.map((item: MotherboardType) => item.brand)),
  ].map((item) => {
    return {
      label: brandTranslationKey(item),
      value: item,
    }
  })
  return options
}

export const getMotherboardChipset = (items: MotherboardType[]) => {
  const options = [
    ...new Set(items.map((item: MotherboardType) => item.chipset)),
  ].map((item) => {
    return {
      label: item,
      value: item,
    }
  })
  return options
}

export const getRAMBrand = (items: RAMType[]) => {
  const options = [...new Set(items.map((item: RAMType) => item.brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getRAMGeneration = (items: RAMType[]) => {
  const options = [...new Set(items.map((item: RAMType) => item.type))].map(
    (item) => {
      return {
        label: item,
        value: item,
      }
    }
  )
  return options
}

export const getSSDBrand = (items: SSDType[]) => {
  const options = [...new Set(items.map((item: SSDType) => item.brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getPSUBrand = (items: PSUType[]) => {
  const options = [...new Set(items.map((item: PSUType) => item.brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getSSDCapacity = (items: SSDType[]) => {
  const options = [...new Set(items.map((item: SSDType) => item.capacity))].map(
    (item) => {
      return {
        label: item,
        value: item,
      }
    }
  )
  return options
}

export const getCaseBrand = (items: CaseType[]) => {
  const options = [...new Set(items.map((item: CaseType) => item.brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getCaseSize = (items: CaseType[]) => {
  const options = [...new Set(items.map((item: CaseType) => item.type))].map(
    (item) => {
      return {
        label: item,
        value: item,
      }
    }
  )
  return options
}

export const getAIOBrand = (items: AIOType[]) => {
  const options = [...new Set(items.map((item: AIOType) => item.brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getAIOSize = (items: AIOType[]) => {
  const options = [...new Set(items.map((item: AIOType) => item.fanSize))].map(
    (item) => {
      return {
        label: item.toString(),
        value: item.toString(),
      }
    }
  )
  return options
}

export const getAirCoolerBrand = (items: AirCoolerType[]) => {
  const options = [
    ...new Set(items.map((item: AirCoolerType) => item.brand)),
  ].map((item) => {
    return {
      label: brandTranslationKey(item),
      value: item,
    }
  })
  return options
}
