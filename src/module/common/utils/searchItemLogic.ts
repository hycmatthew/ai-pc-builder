import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  SSDType,
  PSUType,
  CaseType,
  AIOType,
  AirCoolerType,
} from '../../../constant/objectTypes'

export const searchCPUItem = (cpuList: CPUType[], name: string) => {
  return cpuList.find((item: CPUType) => {
    return item.name === name
  })
}

export const searchGPUItem = (gpuList: GPUType[], model: string) => {
  return gpuList.find((item: GPUType) => {
    return item.model === model
  })
}

export const searchMotherboardItem = (
  motherboardList: MotherboardType[],
  model: string
) => {
  return motherboardList.find((item: MotherboardType) => {
    return item.model === model
  })
}

export const searchRAMItem = (ramList: RAMType[], model: string) => {
  return ramList.find((item: RAMType) => {
    return item.model === model
  })
}

export const searchSSDItem = (ssdList: SSDType[], model: string) => {
  return ssdList.find((item: SSDType) => {
    return item.model === model
  })
}

export const searchPSUItem = (psuList: PSUType[], model: string) => {
  return psuList.find((item: PSUType) => {
    return item.model === model
  })
}

export const searchCaseItem = (caseList: CaseType[], model: string) => {
  return caseList.find((item: CaseType) => {
    return item.model === model
  })
}

export const searchAIOItem = (aioList: AIOType[], name: string) => {
  return aioList.find((item: AIOType) => {
    return item.name === name
  })
}

export const searchAirCoolerItem = (
  airCoolerList: AirCoolerType[],
  model: string
) => {
  return airCoolerList.find((item: AirCoolerType) => {
    return item.model === model
  })
}
