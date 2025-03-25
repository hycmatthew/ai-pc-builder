export type ComponentType = keyof typeof componentConfig

type ComponentConfig = {
  title: string
  imgSize?: {
    width?: number | string
    height?: number | string
  }
  properties: {
    simple: Array<{ label: string; key: string }>
    detail: Array<{ label: string; key: string }>
  }
}

export const componentConfig = {
  cpu: {
    title: 'CPU',
    imgSize: {
      width: 200,
      height: 200,
    },
    properties: {
      simple: [
        { label: 'brand', key: 'Brand' },
        { label: 'socket', key: 'Socket' },
        { label: 'Cores', key: 'Cores' },
        { label: 'Power', key: 'Power' },
      ],
      detail: [
        { label: 'brand', key: 'Brand' },
        { label: 'socket', key: 'Socket' },
        { label: 'Cores', key: 'Cores' },
        { label: 'Threads', key: 'Threads' },
        { label: 'GPU', key: 'GPU' },
        { label: 'SingleCoreScore', key: 'SingleCoreScore' },
        { label: 'MultiCoreScore', key: 'MultiCoreScore' },
        { label: 'Power', key: 'Power' },
      ],
    },
  },
  gpu: {
    title: 'gpu',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand' },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'Img' },
        { label: 'socket', key: 'Manufacturer' },
        { label: 'Cores', key: 'Generation' },
        { label: 'Threads', key: 'MemorySize' },
        { label: 'GPU', key: 'OcClock' },
        { label: 'SingleCoreScore', key: 'Benchmark' },
        { label: 'multiCoreScore', key: 'Power' },
        { label: 'power', key: 'Length' },
      ],
      detail: [
        { label: 'brand', key: 'Brand' },
        { label: 'socket', key: 'Manufacturer' },
        { label: 'Cores', key: 'Generation' },
        { label: 'Threads', key: 'MemorySize' },
        { label: 'GPU', key: 'OcClock' },
        { label: 'SingleCoreScore', key: 'Benchmark' },
        { label: 'multiCoreScore', key: 'Power' },
        { label: 'power', key: 'Length' },
      ],
    },
  },
  motherboard: {
    title: 'motherboard',
    properties: {
      simple: [
        { label: 'brand', key: 'Brand' },
        { label: 'socket', key: 'Socket' },
        { label: 'Chipset', key: 'Chipset' },
        { label: 'RamSlot', key: 'RamSlot' },
        { label: 'RamSupport', key: 'RamSupport' },
        { label: 'M2Slot', key: 'M2Slot' },
        { label: 'FormFactor', key: 'FormFactor' },
        { label: 'Wireless', key: 'Wireless' },
      ],
      detail: [
        { label: 'brand', key: 'Brand' },
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
        { label: 'brand', key: 'Brand' },
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
        { label: 'brand', key: 'Brand' },
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
        { label: 'brand', key: 'Brand' },
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
        { label: 'brand', key: 'Brand' },
        { label: 'Wattage', key: 'Wattage' },
        { label: 'Standard', key: 'Standard' },
        { label: 'Modular', key: 'Modular' },
        { label: 'Efficiency', key: 'Efficiency' },
      ],
      detail: [
        { label: 'brand', key: 'Brand' },
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
        { label: 'brand', key: 'Brand' },
        { label: 'CaseSize', key: 'CaseSize' },
        { label: 'Dimensions', key: 'Dimensions' },
        { label: 'MaxVGAlength', key: 'MaxVGAlength' },
        { label: 'RadiatorSupport', key: 'RadiatorSupport' },
      ],
      detail: [
        { label: 'brand', key: 'Brand' },
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
        { label: 'brand', key: 'Brand' },
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
        { label: 'brand', key: 'Brand' },
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
