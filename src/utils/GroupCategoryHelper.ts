import {
  CoolerType,
  FanType,
  CaseType,
  CPUType,
  GPUType,
  MotherboardType,
  PSUType,
  RAMType,
  SSDType,
} from '../constant/objectTypes'
import { brandTranslationKey, formatSSDCapacity } from './LabelHelper'

export const getCPUBrand = (items: CPUType[]) => {
  const options = [...new Set(items.map((item: CPUType) => item.Brand))].map(
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
  const options = [...new Set(items.map((item: GPUType) => item.Brand))].map(
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
    ...new Set(items.map((item: GPUType) => item.Manufacturer)),
  ].map((item) => {
    return {
      label: brandTranslationKey(item),
      value: item,
    }
  })
  return options
}

export const getGPUType = (items: GPUType[]) => {
  const options = [...new Set(items.map((item: GPUType) => item.Generation))].map(
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
    ...new Set(items.map((item: MotherboardType) => item.Brand)),
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
    ...new Set(items.map((item: MotherboardType) => item.Chipset)),
  ].map((item) => {
    return {
      label: item,
      value: item,
    }
  })
  return options
}

export const getRAMBrand = (items: RAMType[]) => {
  const options = [...new Set(items.map((item: RAMType) => item.Brand))].map(
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
  const options = [...new Set(items.map((item: RAMType) => item.Type))].map(
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
  const options = [...new Set(items.map((item: SSDType) => item.Brand))].map(
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
  const options = [...new Set(items.map((item: PSUType) => item.Brand))].map(
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
  const options = [...new Set(items.map((item: SSDType) => item.Capacity))].map(
    (item) => {
      return {
        label: formatSSDCapacity(item),
        value: item,
      }
    }
  )
  return options
}

export const getCaseBrand = (items: CaseType[]) => {
  const options = [...new Set(items.map((item: CaseType) => item.Brand))].map(
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
  const options = [...new Set(items.map((item: CaseType) => item.CaseSize))].map(
    (item) => {
      return {
        label: item,
        value: item,
      }
    }
  )
  return options
}

export const getAIOBrand = (items: CoolerType[]) => {
  const options = [...new Set(items.map((item: CoolerType) => item.Brand))].map(
    (item) => {
      return {
        label: brandTranslationKey(item),
        value: item,
      }
    }
  )
  return options
}

export const getAIOSize = (items: CoolerType[]) => {
  const options = [...new Set(items.map((item: CoolerType) => item.LiquidCoolerSize))].map(
    (item) => {
      return {
        label: item.toString(),
        value: item.toString(),
      }
    }
  )
  return options
}

export const getAirCoolerBrand = (items: FanType[]) => {
  const options = [
    ...new Set(items.map((item: FanType) => item.brand)),
  ].map((item) => {
    return {
      label: brandTranslationKey(item),
      value: item,
    }
  })
  return options
}
