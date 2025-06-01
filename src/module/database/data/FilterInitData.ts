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
  brand: '',
  model: '',
  price: 0,
}

export const GPU_FILTER_INIT_DATA: GPUFilterType = {
  brand: '',
  manufacturer: '',
  gpu: '',
  model: '',
  price: 0,
}

export const MOTHERBOARD_FILTER_INIT_DATA: MotherboardFilterType = {
  brand: '',
  model: '',
  price: 0,
  size: '',
  chipset: '',
}

export const RAM_FILTER_INIT_DATA: RAMFilterType = {
  brand: '',
  model: '',
  generation: '',
  price: 0,
  size: '',
}

export const SSD_FILTER_INIT_DATA: SSDFilterType = {
  brand: '',
  model: '',
  price: 0,
  capacity: 0,
}

export const PSU_FILTER_INIT_DATA: PSUFilterType = {
  brand: '',
  model: '',
  power: 0,
  efficiency: '',
  price: 0,
  size: '',
}

export const CASE_FILTER_INIT_DATA: CaseFilterType = {
  brand: '',
  model: '',
  price: 0,
  size: '',
}

export const AIO_FILTER_INIT_DATA: AIOFilterType = {
  brand: '',
  model: '',
  price: 0,
  size: 0,
}

export const AIR_COOLER_FILTER_INIT_DATA: AirCoolerFilterType = {
  brand: '',
  model: '',
  price: 0,
}
