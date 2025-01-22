import { flatten } from 'lodash'
import {
  CPUType,
  GPUType,
  MotherboardType,
  RAMType,
  CaseType,
  AIOType,
  AirCoolerType,
} from '../constant/objectTypes'

export const motherboardIncompatibleWithCPU = (
  motherboard: MotherboardType | null,
  cpu: CPUType | null
) => {
  return cpu && motherboard ? motherboard.Socket !== cpu.Socket : false
}

export const ramIncompatibleWithCPU = (ram: RAMType, cpu: CPUType | null) => {
  return cpu && ram ? !ram.Profile.includes(cpu.Brand) : false
}

export const ramIncompatibleWithMotherboard = (
  ram: RAMType,
  motherboard: MotherboardType | null
) => {
  let result = false
  if (ram && motherboard) {
    result =
      !motherboard.RamSupport.includes(ram.Speed.toString()) ||
      !motherboard.RamType.includes(ram.Type)
  }
  return result
}

export const psuPowerNotEnough = (psuPower: number, totalPower: number) => {
  return totalPower > psuPower
}

export const caseIncompatibleWithGPU = (
  pcCase: CaseType | null,
  gpu: GPUType | null
) => {
  return gpu && pcCase ? gpu.Length > pcCase.MaxVGAlength : false
}

export const caseIncompatibleWithMotherboard = (
  pcCase: CaseType,
  motherboard: MotherboardType | null
) => {
  return motherboard && pcCase
    ? !pcCase.Compatibility.includes(motherboard.FormFactor)
    : false
}

export const caseIncompatibleWithAIO = (
  pcCase: CaseType,
  aio: AIOType | null
) => {
  /*
  const listOfAIOSize: number[] = [120, 140, 240, 280, 360, 420]
  let radiatorSupportList: number[] = []
  for (const item of listOfAIOSize) {
    if (pcCase.RadiatorSupport >= item) {
      radiatorSupportList.push(item)
    }
  }
  */
  return aio && pcCase ? aio.Size > pcCase.RadiatorSupport : false
}

export const airCoolerIncompatibleWithCase = (
  airCooler: AirCoolerType,
  pcCase: CaseType | null
) => {
  return airCooler && pcCase
    ? airCooler.maxCoolerHeight > pcCase.MaxCpuCoolorHeight
    : false
}
