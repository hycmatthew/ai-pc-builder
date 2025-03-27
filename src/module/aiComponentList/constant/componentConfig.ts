import { t } from 'i18next'
import { ReactNode } from 'react'

export type ComponentType = keyof typeof componentConfig

type ComponentConfig = {
  title: string
  imgSize?: {
    width?: number | string
    height?: number | string
  }
  properties: {
    simple: Array<{
      label: string
      key: string
      formatter?: (data: any) => ReactNode
    }> // 新增格式化函数 }>
    detail: Array<{
      label: string
      key: string
      formatter?: (data: any) => ReactNode
    }> // 新增格式化函数 }>
  }
}

export const componentConfig = {
  cpu: {
    title: 'CPU',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'socket', key: 'Socket' },
        {
          label: 'Cores/Threads',
          key: 'Cores',
          formatter: (data) => `${data.Cores || '-'}/${data.Threads || '-'}`,
        },
        {
          label: 'Power',
          key: 'Power',
          formatter: (data) => `${data.Power || '-'}W`,
        },
      ],
      detail: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'socket', key: 'Socket' },
        {
          label: 'Cores/Threads',
          key: 'Cores',
          formatter: (data) => `${data.Cores || '-'}/${data.Threads || '-'}`,
        },
        { label: 'GPU', key: 'GPU' },
        { label: 'SingleCoreScore', key: 'SingleCoreScore' },
        { label: 'MultiCoreScore', key: 'MultiCoreScore' },
        {
          label: 'Power',
          key: 'Power',
          formatter: (data) => `${data.Power || '-'}W`,
        },
      ],
    },
  },
  gpu: {
    title: 'gpu',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'Manufacturer', key: 'Manufacturer' },
        { label: 'Generation', key: 'Generation' },
        { label: 'MemorySize', key: 'MemorySize' },
        { label: 'OcClock', key: 'OcClock' },
        { label: 'Benchmark', key: 'Benchmark' },
        { label: 'Power', key: 'Power' },
        { label: 'Length', key: 'Length' },
      ],
      detail: [
        { label: 'brand', key: 'Brand', formatter: (data) => `${t(data.Brand)}`, },
        { label: 'Manufacturer', key: 'Manufacturer' },
        { label: 'Generation', key: 'Generation' },
        { label: 'MemorySize', key: 'MemorySize' },
        { label: 'MemoryBus', key: 'MemoryBus' },
        { label: 'BoostClock', key: 'BoostClock' },
        { label: 'OcClock', key: 'OcClock' },
        { label: 'Benchmark', key: 'Benchmark' },
        { label: 'Power', key: 'Power' },
        { label: 'Length', key: 'Length' },
        { label: 'Slot', key: 'Slot' },
      ],
    },
  },
  motherboard: {
    title: 'motherboard',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'socket', key: 'Socket' },
        { label: 'Chipset', key: 'Chipset' },
        { label: 'RamSlot', key: 'RamSlot' },
        { label: 'RamSupport', key: 'RamSupport' },
        { label: 'M2Slot', key: 'M2Slot' },
        { label: 'FormFactor', key: 'FormFactor' },
        { label: 'Wireless', key: 'Wireless' },
      ],
      detail: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'socket', key: 'Socket' },
        { label: 'Chipset', key: 'Chipset' },
        { label: 'RamSlot', key: 'RamSlot' },
        { label: 'RamSupport', key: 'RamSupport' },
        { label: 'M2Slot', key: 'M2Slot' },
        { label: 'FormFactor', key: 'FormFactor' },
        { label: 'Wireless', key: 'Wireless' },
      ],
    },
  },
  ram: {
    title: 'ram',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'Img' },
        { label: 'Capacity', key: 'Capacity' },
        { label: 'Type', key: 'Type' },
        { label: 'Speed', key: 'Speed' },
        { label: 'Latency', key: 'Latency' },
        { label: 'Timing', key: 'Timing' },
        { label: 'Channel', key: 'Channel' },
        { label: 'Profile', key: 'Profile' },
      ],
      detail: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'Img' },
        { label: 'Capacity', key: 'Capacity' },
        { label: 'Type', key: 'Type' },
        { label: 'Speed', key: 'Speed' },
        { label: 'Latency', key: 'Latency' },
        { label: 'Timing', key: 'Timing' },
        { label: 'Channel', key: 'Channel' },
        { label: 'Profile', key: 'Profile' },
      ],
    },
  },
  ssd: {
    title: 'ssd',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'Capacity', key: 'Capacity' },
        { label: 'MaxRead', key: 'MaxRead' },
        { label: 'MaxWrite', key: 'MaxWrite' },
        { label: 'Interface', key: 'Interface' },
        { label: 'FormFactor', key: 'FormFactor' },
      ],
      detail: [
        { label: 'brand', key: 'Brand' },
        { label: 'Capacity', key: 'Capacity' },
        { label: 'MaxRead', key: 'MaxRead' },
        { label: 'MaxWrite', key: 'MaxWrite' },
        { label: 'Interface', key: 'Interface' },
        { label: 'FormFactor', key: 'FormFactor' },
      ],
    },
  },
  psu: {
    title: 'power-supply',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'Wattage', key: 'Wattage' },
        { label: 'Standard', key: 'Standard' },
        { label: 'Modular', key: 'Modular' },
        { label: 'Efficiency', key: 'Efficiency' },
      ],
      detail: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'Wattage', key: 'Wattage' },
        { label: 'Standard', key: 'Standard' },
        { label: 'Modular', key: 'Modular' },
        { label: 'Efficiency', key: 'Efficiency' },
      ],
    },
  },
  pcCase: {
    title: 'pc-case',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'CaseSize', key: 'CaseSize' },
        { label: 'Dimensions', key: 'Dimensions' },
        { label: 'MaxVGAlength', key: 'MaxVGAlength' },
        { label: 'RadiatorSupport', key: 'RadiatorSupport' },
      ],
      detail: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        { label: 'CaseSize', key: 'CaseSize' },
        { label: 'Dimensions', key: 'Dimensions' },
        { label: 'MaxVGAlength', key: 'MaxVGAlength' },
        { label: 'RadiatorSupport', key: 'RadiatorSupport' },
      ],
    },
  },
  cooler: {
    title: 'cooler',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'Img' },
        { label: 'Sockets', key: 'Sockets' },
        { label: 'IsLiquidCooler', key: 'IsLiquidCooler' },
        { label: 'AirCoolerHeight', key: 'AirCoolerHeight' },
        { label: 'NoiseLevel', key: 'NoiseLevel' },
        { label: 'FanSpeed', key: 'FanSpeed' },
        { label: 'Airflow', key: 'Airflow' },
        // { label: 'Pressure', key: 'Pressure' },
      ],
      detail: [
        { label: 'brand', key: 'Brand', formatter: (data) => t(data.Brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'Img' },
        { label: 'Sockets', key: 'Sockets' },
        { label: 'IsLiquidCooler', key: 'IsLiquidCooler' },
        { label: 'AirCoolerHeight', key: 'AirCoolerHeight' },
        { label: 'NoiseLevel', key: 'NoiseLevel' },
        { label: 'FanSpeed', key: 'FanSpeed' },
        { label: 'Airflow', key: 'Airflow' },
        // { label: 'Pressure', key: 'Pressure' },
      ],
    },
  },
} satisfies Record<string, ComponentConfig>

export type DisplayType = keyof (typeof componentConfig)['cpu']['properties']
