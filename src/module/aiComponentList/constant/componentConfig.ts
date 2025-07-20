import { ReactNode } from 'react'
import {
  brandTranslationKey,
  diskSpeedLabelHandler,
  formatNormalCapacity,
  handleYesNoFromNum,
  lengthLabelHandler,
} from '../../../utils/LabelHelper'
import { t } from 'i18next'

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
    title: 'cpu',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'socket', key: 'socket' },
        {
          label: 'cpu-cores',
          key: 'cores',
          formatter: (data) => `${data.cores || '-'}/${data.threads || '-'}`,
        },
        {
          label: 'power',
          key: 'power',
          formatter: (data) => `${data.power || '-'}W`,
        },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'socket', key: 'socket' },
        {
          label: 'cpu-cores',
          key: 'cores',
          formatter: (data) => `${data.cores || '-'}/${data.threads || '-'}`,
        },
        { label: 'cpu-integrated-graphics', key: 'gpu' },
        { label: 'cpu-single-score', key: 'single_core_score' },
        { label: 'cpu-multi-score', key: 'multi_core_score' },
        {
          label: 'power',
          key: 'power',
          formatter: (data) => `${data.power || '-'}W`,
        },
      ],
    },
  },
  gpu: {
    title: 'graphic-card',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'manufacturer', key: 'manufacturer' },
        { label: 'chipset', key: 'chipset' },
        {
          label: 'gpu-memory-size',
          key: 'memory_size',
          formatter: (data) => formatNormalCapacity(data.memory_size),
        },
        { label: 'gpu-oc-clock', key: 'boost_clock' },
        { label: 'benchmark', key: 'benchmark' },
        { label: 'gpu-power', key: 'power' },
        {
          label: 'gpu-length',
          key: 'length',
          formatter: (data) => lengthLabelHandler(data.length),
        },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => `${brandTranslationKey(data.brand)}`,
        },
        { label: 'manufacturer', key: 'manufacturer' },
        { label: 'gpu-series', key: 'series' },
        { label: 'chipset', key: 'chipset' },
        { label: 'gpu-memory-type', key: 'memory_type' },
        {
          label: 'gpu-memory-size',
          key: 'memory_size',
          formatter: (data) => formatNormalCapacity(data.memory_size),
        },
        { label: 'gpu-memory-interface', key: 'memory_bus' },
        { label: 'gpu-clock', key: 'clock_rate' },
        { label: 'gpu-oc-clock', key: 'boost_clock' },
        { label: 'gpu-benchmark', key: 'benchmark' },
        { label: 'gpu-power', key: 'power' },
        {
          label: 'gpu-length',
          key: 'length',
          formatter: (data) => lengthLabelHandler(data.length),
        },
        { label: 'gpu-slots', key: 'slot' },
      ],
    },
  },
  motherboard: {
    title: 'motherboard',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'socket', key: 'socket' },
        { label: 'chipset', key: 'chipset' },
        { label: 'mb-ram-slots', key: 'ram_slot' },
        {
          label: 'mb-ram-type',
          key: 'ram_type',
        },
        {
          label: 'mb-ram-support',
          key: 'ram_support',
          formatter: (data) => {
            const speeds = data.ram_support
            if (!Array.isArray(speeds)) return speeds
            const maxSpeed = Math.max(...speeds)
            return `${t('mb-max-speed-upto')} ${maxSpeed}`
          },
        },
        { label: 'mb-m2-slots', key: 'm2_slot' },
        { label: 'form-factor', key: 'form_factor' },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'form-factor', key: 'form_factor' },
        { label: 'socket', key: 'socket' },
        { label: 'chipset', key: 'chipset' },
        { label: 'mb-ram-slots', key: 'ram_slot' },
        {
          label: 'mb-max-ram',
          key: 'ram_max',
          formatter: (data) => formatNormalCapacity(data.ram_max),
        },
        {
          label: 'mb-ram-support',
          key: 'ram_support',
          formatter: (data) => {
            const speeds = data.ram_support
            if (!Array.isArray(speeds)) return speeds
            return speeds.join(', ')
          },
        },
        { label: 'mb-m2-slots', key: 'm2_slot' },
        { label: 'mb-pcie-16-slots', key: 'pcie_16_slot' },
        { label: 'wireless', key: 'wireless' },
      ],
    },
  },
  ram: {
    title: 'ram',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        {
          label: 'ram-capacity',
          key: 'capacity',
          formatter: (data) => formatNormalCapacity(data.capacity),
        },
        { label: 'ram-type', key: 'type' },
        { label: 'ram-frequency', key: 'speed' },
        { label: 'ram-latency', key: 'latency' },
        { label: 'ram-timing', key: 'timing' },
        { label: 'ram-channel', key: 'channel' },
        {
          label: 'ram-profile',
          key: 'profile',
          formatter: (data) => {
            let res = ''
            if (data.profile_xmp) {
              res = `${t('ram-xmp-profile')}`
            }
            if (data.profile_expo) {
              if (res !== '') {
                res += '/'
              }
              res += `${t('ram-expo-profile')}`
            }
            return res
          },
        },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'ram-series', key: 'series' },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        {
          label: 'ram-capacity',
          key: 'capacity',
          formatter: (data) => formatNormalCapacity(data.capacity),
        },
        { label: 'ram-type', key: 'type' },
        { label: 'ram-frequency', key: 'speed' },
        { label: 'ram-latency', key: 'latency' },
        { label: 'ram-timing', key: 'timing' },
        { label: 'ram-channel', key: 'channel' },
        { label: 'ram-voltage', key: 'voltage' },
        {
          label: 'ram-profile',
          key: 'profile',
          formatter: (data) => {
            let res = ''
            if (data.profile_xmp) {
              res = `${t('ram-xmp-profile')} `
            }
            if (data.profile_expo) {
              res += `${t('ram-expo-profile')}`
            }
            return res
          },
        },
        { label: 'ram-led', key: 'led' },
      ],
    },
  },
  ssd: {
    title: 'ssd',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'capacity', key: 'capacity' },
        {
          label: 'ssd-max-read',
          key: 'max_read',
          formatter: (data) => diskSpeedLabelHandler(data.max_read),
        },
        {
          label: 'ssd-max-write',
          key: 'max_write',
          formatter: (data) => diskSpeedLabelHandler(data.max_write),
        },
        { label: 'ssd-interface', key: 'interface' },
        { label: 'ssd-form-factor', key: 'form_factor' },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'ssd-series', key: 'series' },
        { label: 'capacity', key: 'capacity' },
        { label: 'ssd-interface', key: 'interface' },
        { label: 'ssd-form-factor', key: 'form_factor' },
        { label: 'ssd-flash-type', key: 'flash_type' },
        {
          label: 'ssd-max-read',
          key: 'max_read',
          formatter: (data) => diskSpeedLabelHandler(data.max_read),
        },
        {
          label: 'ssd-max-write',
          key: 'max_write',
          formatter: (data) => diskSpeedLabelHandler(data.max_write),
        },
        {
          label: 'ssd-read-4k',
          key: 'read_4k',
          formatter: (data) => diskSpeedLabelHandler(data.read_4k),
        },
        {
          label: 'ssd-write-4k',
          key: 'write_4k',
          formatter: (data) => diskSpeedLabelHandler(data.write_4k),
        },
        {
          label: 'ssd-dram',
          key: 'dram',
          formatter: (data) => handleYesNoFromNum(data.dram),
        },
        {
          label: 'ssd-heatsink',
          key: 'heatsink',
          formatter: (data) => handleYesNoFromNum(data.heatsink),
        },
      ],
    },
  },
  psu: {
    title: 'psu',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'psu-wattage', key: 'wattage' },
        { label: 'psu-standard', key: 'standard' },
        { label: 'psu-modular', key: 'modular' },
        { label: 'efficiency', key: 'efficiency' },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'psu-wattage', key: 'wattage' },
        { label: 'psu-standard', key: 'standard' },
        { label: 'psu-modular', key: 'modular' },
        { label: 'efficiency', key: 'efficiency' },
      ],
    },
  },
  pcCase: {
    title: 'computer-case',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'case-size', key: 'case_size' },
        {
          label: 'case-dimensions',
          key: 'dimensions',
          formatter: (data) => {
            const dimensions = data.dimensions
            if (!Array.isArray(dimensions)) return dimensions
            return dimensions.join('*')
          },
        },
        {
          label: 'max-gpu-length',
          key: 'max_vga_length',
          formatter: (data) => lengthLabelHandler(data.max_vga_length),
        },
        {
          label: 'case-radiator-support',
          key: 'radiator_support',
          formatter: (data) => {
            return `${t('case-radiator-upto')} ${data.radiator_support}`
          },
        },
        {
          label: 'case-max-cpu-cooler-height',
          key: 'max_cpu_cooler_height',
          formatter: (data) => lengthLabelHandler(data.max_cpu_cooler_height),
        },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        { label: 'case-size', key: 'case_size' },
        {
          label: 'case-dimensions',
          key: 'dimensions',
          formatter: (data) => {
            const dimensions = data.dimensions
            if (!Array.isArray(dimensions)) return dimensions
            return dimensions.join('*')
          },
        },
        {
          label: 'max-gpu-length',
          key: 'max_vga_length',
          formatter: (data) => lengthLabelHandler(data.max_vga_length),
        },
        { label: 'case-radiator-support', key: 'radiator_support' },
        {
          label: 'case-max-cpu-cooler-height',
          key: 'max_cpu_cooler_height',
          formatter: (data) => lengthLabelHandler(data.max_cpu_cooler_height),
        },
      ],
    },
  },
  cooler: {
    title: 'cpu-cooler',
    properties: {
      simple: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        {
          label: 'cooler-sockets',
          key: 'sockets',
          formatter: (data) => {
            const sockets = data.sockets
            if (!Array.isArray(sockets)) return sockets
            return sockets.join(', ')
          },
        },
        { label: 'is-liquid-cooler', key: 'is_liquid_cooler' },
        { label: 'cooler-air-height', key: 'air_cooler_height' },
        { label: 'cooler-noise-level', key: 'noise_level' },
        { label: 'cooler-fan-speed', key: 'fan_speed' },
        { label: 'cooler-air-flow', key: 'airflow' },
        // { label: 'Pressure', key: 'pressure' },
      ],
      detail: [
        {
          label: 'brand',
          key: 'brand',
          formatter: (data) => brandTranslationKey(data.brand),
        },
        //{ label: 'name', key: 'Name' },
        //{ label: 'image', key: 'img' },
        {
          label: 'cooler-sockets',
          key: 'sockets',
          formatter: (data) => {
            const sockets = data.sockets
            if (!Array.isArray(sockets)) return sockets
            return sockets.join(', ')
          },
        },
        { label: 'is-liquid-cooler', key: 'is_liquid_cooler' },
        { label: 'cooler-air-height', key: 'air_cooler_height' },
        { label: 'cooler-noise-level', key: 'noise_level' },
        { label: 'cooler-fan-speed', key: 'fan_speed' },
        { label: 'cooler-air-flow', key: 'airflow' },
        { label: 'cooler-led', key: 'led' },
        // { label: 'Pressure', key: 'pressure' },
      ],
    },
  },
} satisfies Record<string, ComponentConfig>
