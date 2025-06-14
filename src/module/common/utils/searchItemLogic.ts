import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  SSDType,
  PSUType,
  CaseType,
  CoolerType,
  FanType,
} from '../../../constant/objectTypes'

export const searchCPUItem = (cpuList: CPUType[], id: string) => {
  return cpuList.find((item: CPUType) => item.id === id)
}

export const searchGPUItem = (gpuList: GPUType[], id: string) => {
  return gpuList.find((item: GPUType) =>  item.id === id)
}

export const searchMotherboardItem = (
  motherboardList: MotherboardType[],
  id: string
) => {
  return motherboardList.find((item: MotherboardType) => item.id === id)
}

export const searchRAMItem = (ramList: RAMType[], id: string) => {
  return ramList.find((item: RAMType) => item.id === id)
}

export const searchSSDItem = (ssdList: SSDType[], id: string) => {
  return ssdList.find((item: SSDType) => item.id === id)
}

export const searchPSUItem = (psuList: PSUType[], id: string) => {
  return psuList.find((item: PSUType) => item.id === id)
}

export const searchCaseItem = (caseList: CaseType[], id: string) => {
  return caseList.find((item: CaseType) => item.id === id)
}

export const searchAIOItem = (coolerList: CoolerType[], id: string) => {
  return coolerList.find((item: CoolerType) => item.id === id)
}

export const searchAirCoolerItem = (
  airCoolerList: FanType[],
  model: string
) => {
  return airCoolerList.find((item: FanType) => {
    return item.model === model
  })
}
