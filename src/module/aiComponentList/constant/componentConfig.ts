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
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'socket', key: 'socket' },
        {
          label: 'Cores/Threads',
          key: 'cores',
          formatter: (data) => `${data.cores || '-'}/${data.threads || '-'}`,
        },
        {
          label: 'Power',
          key: 'power',
          formatter: (data) => `${data.power || '-'}W`,
        },
      ],
      detail: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'socket', key: 'socket' },
        {
          label: 'Cores/Threads',
          key: 'Cores',
          formatter: (data) => `${data.cores || '-'}/${data.Threads || '-'}`,
        },
        { label: 'GPU', key: 'gpu' },
        { label: 'SingleCoreScore', key: 'single_core_score' },
        { label: 'MultiCoreScore', key: 'multi_core_score' },
        {
          label: 'Power',
          key: 'power',
          formatter: (data) => `${data.power || '-'}W`,
        },
      ],
    },
  },
  gpu: {
    title: 'gpu',
    properties: {
      simple: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'Manufacturer', key: 'manufacturer' },
        { label: 'Series', key: 'series' },
        { label: 'MemorySize', key: 'memory_size' },
        { label: 'BoostClock', key: 'boost_clock' },
        { label: 'Benchmark', key: 'benchmark' },
        { label: 'Power', key: 'power' },
        { label: 'Length', key: 'length' },
      ],
      detail: [
        { label: 'brand', key: 'brand', formatter: (data) => `${t(data.brand)}`, },
        { label: 'Manufacturer', key: 'manufacturer' },
        { label: 'Generation', key: 'generation' },
        { label: 'MemorySize', key: 'memorySize' },
        { label: 'MemoryBus', key: 'memoryBus' },
        { label: 'BoostClock', key: 'boostClock' },
        { label: 'OcClock', key: 'OcClock' },
        { label: 'Benchmark', key: 'benchmark' },
        { label: 'Power', key: 'power' },
        { label: 'Length', key: 'length' },
        { label: 'Slot', key: 'slot' },
      ],
    },
  },
  motherboard: {
    title: 'motherboard',
    properties: {
      simple: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'socket', key: 'socket' },
        { label: 'Chipset', key: 'chipset' },
        { label: 'RamSlot', key: 'ram_slot' },
        { label: 'RamSupport', key: 'ram_support' },
        { label: 'M2Slot', key: 'm2_slot' },
        { label: 'FormFactor', key: 'form_factor' },
        { label: 'Wireless', key: 'wireless' },
      ],
      detail: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'socket', key: 'socket' },
        { label: 'Chipset', key: 'chipset' },
        { label: 'RamSlot', key: 'ram_slot' },
        { label: 'RamSupport', key: 'ram_support' },
        { label: 'M2Slot', key: 'm2Slot' },
        { label: 'FormFactor', key: 'form_factor' },
        { label: 'Wireless', key: 'wireless' },
      ],
    },
  },
  ram: {
    title: 'ram',
    properties: {
      simple: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        { label: 'Capacity', key: 'capacity' },
        { label: 'Type', key: 'type' },
        { label: 'Speed', key: 'speed' },
        { label: 'Latency', key: 'latency' },
        { label: 'Timing', key: 'timing' },
        { label: 'Channel', key: 'channel' },
        { label: 'Profile', key: 'profile' },
      ],
      detail: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        { label: 'Capacity', key: 'capacity' },
        { label: 'Type', key: 'type' },
        { label: 'Speed', key: 'speed' },
        { label: 'Latency', key: 'latency' },
        { label: 'Timing', key: 'timing' },
        { label: 'Channel', key: 'channel' },
        { label: 'Profile', key: 'profile' },
      ],
    },
  },
  ssd: {
    title: 'ssd',
    properties: {
      simple: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'Capacity', key: 'capacity' },
        { label: 'MaxRead', key: 'max_read' },
        { label: 'MaxWrite', key: 'max_write' },
        { label: 'Interface', key: 'interface' },
        { label: 'FormFactor', key: 'form_factor' },
      ],
      detail: [
        { label: 'brand', key: 'brand' },
        { label: 'Capacity', key: 'capacity' },
        { label: 'MaxRead', key: 'max_read' },
        { label: 'MaxWrite', key: 'max_write' },
        { label: 'Interface', key: 'interface' },
        { label: 'FormFactor', key: 'form_factor' },
      ],
    },
  },
  psu: {
    title: 'power-supply',
    properties: {
      simple: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'Wattage', key: 'wattage' },
        { label: 'Standard', key: 'standard' },
        { label: 'Modular', key: 'modular' },
        { label: 'Efficiency', key: 'efficiency' },
      ],
      detail: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'Wattage', key: 'wattage' },
        { label: 'Standard', key: 'standard' },
        { label: 'Modular', key: 'modular' },
        { label: 'Efficiency', key: 'efficiency' },
      ],
    },
  },
  pcCase: {
    title: 'pc-case',
    properties: {
      simple: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'CaseSize', key: 'case_size' },
        { label: 'Dimensions', key: 'dimensions' },
        { label: 'MaxVGAlength', key: 'max_vga_length' },
        { label: 'RadiatorSupport', key: 'radiator_support' },
      ],
      detail: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        { label: 'CaseSize', key: 'case_size' },
        { label: 'Dimensions', key: 'dimensions' },
        { label: 'MaxVGAlength', key: 'max_vga_length' },
        { label: 'RadiatorSupport', key: 'radiator_support' },
      ],
    },
  },
  cooler: {
    title: 'cooler',
    properties: {
      simple: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        { label: 'Sockets', key: 'sockets' },
        { label: 'IsLiquidCooler', key: 'is_liquid_cooler' },
        { label: 'AirCoolerHeight', key: 'air_cooler_height' },
        { label: 'NoiseLevel', key: 'noise_level' },
        { label: 'FanSpeed', key: 'fan_speed' },
        { label: 'Airflow', key: 'airflow' },
        // { label: 'Pressure', key: 'pressure' },
      ],
      detail: [
        { label: 'brand', key: 'brand', formatter: (data) => t(data.brand), },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        { label: 'Sockets', key: 'sockets' },
        { label: 'IsLiquidCooler', key: 'is_liquid_cooler' },
        { label: 'AirCoolerHeight', key: 'air_cooler_height' },
        { label: 'NoiseLevel', key: 'noise_level' },
        { label: 'FanSpeed', key: 'fan_speed' },
        { label: 'Airflow', key: 'airflow' },
        // { label: 'Pressure', key: 'pressure' },
      ],
    },
  },
} satisfies Record<string, ComponentConfig>

export type DisplayType = keyof (typeof componentConfig)['cpu']['properties']
