import {
  AIOFilterType,
  AirCoolerFilterType,
  CaseFilterType,
  CPUFilterType,
  GPUFilterType,
  MotherboardFilterType,
  PSUFilterType,
  RAMFilterType,
  SSDFilterType,
} from './FilterType'

export const CPU_FILTER_INIT_DATA: CPUFilterType = {
  id: '',
  brand: '',
  price: 0,
}

export const GPU_FILTER_INIT_DATA: GPUFilterType = {
  brand: '',
  manufacturer: '',
  gpu: '',
  id: '',
  price: 0,
}

export const MOTHERBOARD_FILTER_INIT_DATA: MotherboardFilterType = {
  brand: '',
  id: '',
  price: 0,
  size: '',
  chipset: '',
}

export const RAM_FILTER_INIT_DATA: RAMFilterType = {
  brand: '',
  id: '',
  generation: '',
  price: 0,
  size: '',
}

export const SSD_FILTER_INIT_DATA: SSDFilterType = {
  brand: '',
  id: '',
  price: 0,
  capacity: 0,
}

export const PSU_FILTER_INIT_DATA: PSUFilterType = {
  brand: '',
  id: '',
  power: 0,
  efficiency: '',
  price: 0,
  size: '',
}

export const CASE_FILTER_INIT_DATA: CaseFilterType = {
  brand: '',
  id: '',
  price: 0,
  size: '',
}

export const AIO_FILTER_INIT_DATA: AIOFilterType = {
  brand: '',
  id: '',
  price: 0,
  size: 0,
}

export const AIR_COOLER_FILTER_INIT_DATA: AirCoolerFilterType = {
  brand: '',
  id: '',
  price: 0,
}
