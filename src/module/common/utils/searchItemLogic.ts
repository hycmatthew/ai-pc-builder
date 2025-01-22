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
  return cpuList.find((item: CPUType) => item.Name === name)
}

export const searchGPUItem = (gpuList: GPUType[], name: string) => {
  return gpuList.find((item: GPUType) =>  item.Name === name)
}

export const searchMotherboardItem = (
  motherboardList: MotherboardType[],
  name: string
) => {
  return motherboardList.find((item: MotherboardType) => item.Name === name)
}

export const searchRAMItem = (ramList: RAMType[], name: string) => {
  return ramList.find((item: RAMType) => item.Name === name)
}

export const searchSSDItem = (ssdList: SSDType[], name: string) => {
  return ssdList.find((item: SSDType) => item.Name === name)
}

export const searchPSUItem = (psuList: PSUType[], name: string) => {
  return psuList.find((item: PSUType) => item.Name === name)
}

export const searchCaseItem = (caseList: CaseType[], name: string) => {
  return caseList.find((item: CaseType) => item.Name === name)
}

export const searchAIOItem = (aioList: AIOType[], name: string) => {
  return aioList.find((item: AIOType) => item.Name === name)
}

export const searchAirCoolerItem = (
  airCoolerList: AirCoolerType[],
  model: string
) => {
  return airCoolerList.find((item: AirCoolerType) => {
    return item.model === model
  })
}
