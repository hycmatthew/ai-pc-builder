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
  return cpu && motherboard ? motherboard.socket !== cpu.socket : false
}

export const ramIncompatibleWithCPU = (ram: RAMType, cpu: CPUType | null) => {
  return cpu && ram ? !ram.chipset.includes(cpu.brand) : false
}

export const ramIncompatibleWithMotherboard = (
  ram: RAMType,
  motherboard: MotherboardType | null
) => {
  let result = false
  if (ram && motherboard) {
    result = (!motherboard.supportedRam.includes(ram.speed.toString()) || !motherboard.ramType.includes(ram.type))
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
  return gpu && pcCase ? gpu.length > pcCase.maxGPULength : false
}

export const caseIncompatibleWithMotherboard = (
  pcCase: CaseType,
  motherboard: MotherboardType | null
) => {
  return motherboard && pcCase
    ? !pcCase.motherboardCompatibility.includes(motherboard.sizeType)
    : false
}

export const caseIncompatibleWithAIO = (
  pcCase: CaseType,
  aio: AIOType | null
) => {
  return aio && pcCase ? !flatten(pcCase.radiatorOptions).includes(aio.fanSize) : false
}

export const airCoolerIncompatibleWithCase = (
  airCooler: AirCoolerType,
  pcCase: CaseType | null
) => {
  return airCooler && pcCase ? airCooler.maxCoolerHeight > pcCase.maxCPUCoolerLength : false
}
