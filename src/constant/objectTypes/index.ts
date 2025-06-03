export type { default as CoolerType } from './CoolerType'
export type { default as CaseType } from './CaseType'
export type { default as CPUType } from './CPUType'
export type { default as GPUType } from './GPUType'
export type { default as MotherboardType } from './MotherboardType'
export type { default as PSUType } from './PSUType'
export type { default as RAMType } from './RAMType'
export type { default as SSDType } from './SSDType'
export type { default as FanType } from './FanType'
export type { default as OptionType } from './OptionType'

export type AllType =
  | import('./CPUType').default
  | import('./GPUType').default
  | import('./RAMType').default
  | import('./SSDType').default
  | import('./PSUType').default
  | import('./MotherboardType').default
  | import('./CaseType').default
  | import('./CoolerType').default
