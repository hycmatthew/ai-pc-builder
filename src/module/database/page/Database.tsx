import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@mui/material'

import { useSelector } from 'react-redux'
import ProductEnum from '../../../constant/ProductEnum'
import CPUSuggestion from '../components/CPUSuggestion'
import GPUSuggestion from '../components/GPUSuggestion'
import MotherboardSuggestion from '../components/MotherboardSuggestion'
import RAMSuggestion from '../components/RAMSuggestion'
import SSDSuggestion from '../components/SSDSuggestion'
import PSUSuggestion from '../components/PSUSuggestion'
import CaseSuggestion from '../components/CaseSuggestion'
import CoolerSuggestion from '../components/CoolerSuggestion'
import SegmentedTabs from '../../common/components/SegmentedTabs'
import CustomAutocomplete from '../../common/components/CustomAutocomplete'
import { RangeSlider } from '../../common/components/RangeSlider'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'
import {
  AllType,
  CaseType,
  CoolerType,
  CPUType,
  GPUType,
  MotherboardType,
  PSUType,
  RAMType,
  SSDType,
} from '../../../constant/objectTypes'
import {
  brandTranslationKey,
  formatNormalCapacity,
  formatSSDCapacity,
  lengthLabelHandler,
} from '../../../utils/LabelHelper'

const Database = () => {
  const { t } = useTranslation()
  const tabs = [
    { label: t('cpu'), value: ProductEnum.CPU },
    { label: t('motherboard'), value: ProductEnum.Motherboard },
    { label: t('graphic-card'), value: ProductEnum.GPU },
    { label: t('ram'), value: ProductEnum.RAM },
    { label: t('ssd'), value: ProductEnum.SSD },
    { label: t('psu'), value: ProductEnum.PSU },
    { label: t('computer-case'), value: ProductEnum.ComputerCase },
    { label: t('cpu-cooler'), value: ProductEnum.Cooler },
  ]

  const dataState = useSelector((state: any) => state.rawData)
  const [selectedType, setSelectedType] = useState(ProductEnum.CPU)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  // 获取当前硬件类型对应的品牌列表
  const brandOptions = useMemo(() => {
    const dataMap = {
      [ProductEnum.CPU]: dataState.cpuList,
      [ProductEnum.GPU]: dataState.gpuList,
      [ProductEnum.Motherboard]: dataState.motherboardList,
      [ProductEnum.RAM]: dataState.ramList,
      [ProductEnum.SSD]: dataState.ssdList,
      [ProductEnum.PSU]: dataState.psuList,
      [ProductEnum.ComputerCase]: dataState.caseList,
      [ProductEnum.Cooler]: dataState.coolerList,
    }

    const currentList = dataMap[selectedType] || []
    const brands = [...new Set(currentList.map((item: AllType) => item.brand))]
      .filter(Boolean)
      .sort()

    return brands.map((brand) => ({
      label: brandTranslationKey(brand as string),
      value: brand as string,
    }))
  }, [selectedType, dataState])

  // 獲取當前硬件類型的價格範圍
  const { minPrice, maxPrice } = useMemo(() => {
    const dataMap = {
      [ProductEnum.CPU]: dataState.cpuList,
      [ProductEnum.GPU]: dataState.gpuList,
      [ProductEnum.Motherboard]: dataState.motherboardList,
      [ProductEnum.RAM]: dataState.ramList,
      [ProductEnum.SSD]: dataState.ssdList,
      [ProductEnum.PSU]: dataState.psuList,
      [ProductEnum.ComputerCase]: dataState.caseList,
      [ProductEnum.Cooler]: dataState.coolerList,
    }

    const currentList = dataMap[selectedType] || []
    // 提取價格並轉換為數字
    const prices = currentList.map((item: any) => {
      const itemPrice = getLocalizedPriceNum(item) // 使用 getCurrentPriceNum 函数获取价格
      return isFinite(itemPrice) ? itemPrice : 0
    })

    if (prices.length === 0) return { minPrice: 0, maxPrice: 9999 }

    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return { minPrice: min, maxPrice: max }
  }, [selectedType, dataState])

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ])
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ])

  // 当切换硬件类型时重置品牌筛选
  useEffect(() => {
    setSelectedBrand(null)
    setPriceRange([minPrice, maxPrice])
    setSelectedPrice([minPrice, maxPrice])

    // 清除当前硬件类型对应的特定筛选条件
    console.log('setSpecificFilters')
    setSpecificFilters({})
  }, [selectedType])

  const updateType = (_event: React.SyntheticEvent, newValue: any) => {
    if (newValue !== null) {
      setSelectedType(newValue as ProductEnum)
    }
  }

  // 價格篩選變化處理
  const handlePriceChange = (newValue: number[]) => {
    setSelectedPrice(newValue as [number, number])
  }

  // 创建带筛选功能的内容逻辑
  const createSelectLogic = (type: ProductEnum) => {
    const filterProps = {
      brandFilter: selectedBrand,
      isLoading: dataState.isLoading,
    }

    switch (type) {
      case ProductEnum.CPU:
        return (
          <CPUSuggestion
            {...filterProps}
            cpuList={filterList(dataState.cpuList)}
          />
        )
      case ProductEnum.GPU:
        return (
          <GPUSuggestion
            {...filterProps}
            gpuList={filterList(dataState.gpuList)}
          />
        )
      case ProductEnum.Motherboard:
        return (
          <MotherboardSuggestion
            {...filterProps}
            motherboardList={filterList(dataState.motherboardList)}
          />
        )
      case ProductEnum.RAM:
        return (
          <RAMSuggestion
            {...filterProps}
            ramList={filterList(dataState.ramList)}
          />
        )
      case ProductEnum.SSD:
        return (
          <SSDSuggestion
            {...filterProps}
            ssdList={filterList(dataState.ssdList)}
          />
        )
      case ProductEnum.PSU:
        return (
          <PSUSuggestion
            {...filterProps}
            psuList={filterList(dataState.psuList)}
          />
        )
      case ProductEnum.ComputerCase:
        return (
          <CaseSuggestion
            {...filterProps}
            caseList={filterList(dataState.caseList)}
          />
        )
      case ProductEnum.Cooler:
        return (
          <CoolerSuggestion
            {...filterProps}
            coolerList={filterList(dataState.coolerList)}
          />
        )
      default:
        return null
    }
  }

  // 新增：特定過濾器狀態（使用物件存儲不同類型的過濾條件）
  const [specificFilters, setSpecificFilters] = useState<Record<string, any>>(
    {}
  )

  // 定義各硬體類型專用過濾器配置
  const specificFilterConfig: Partial<Record<ProductEnum, any[]>> = useMemo(
    () => ({
      [ProductEnum.CPU]: [
        {
          type: 'select',
          key: 'socket',
          label: t('socket'),
          getOptions: (list: CPUType[]) =>
            [...new Set(list.map((item) => item.socket))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
      ],
      [ProductEnum.GPU]: [
        {
          type: 'select',
          key: 'manufacturer',
          label: t('manufacturer'),
          getOptions: (list: GPUType[]) =>
            [...new Set(list.map((item) => item.manufacturer))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
        {
          type: 'select',
          key: 'chipset',
          label: t('chipset'),
          getOptions: (list: GPUType[]) =>
            [...new Set(list.map((item) => item.chipset))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
        {
          type: 'select',
          key: 'memory-size',
          label: t('gpu-memory-size'),
          getOptions: (list: GPUType[]) => {
            const sizes = [
              ...new Set(list.map((item) => item.memory_size)),
            ].filter(
              (size): size is number => typeof size === 'number' && !isNaN(size)
            )
            return sizes
              .sort((a, b) => a - b)
              .map((value) => ({ value, label: formatNormalCapacity(value) }))
          },
        },
        {
          type: 'select',
          key: 'memory-bus',
          label: t('gpu-memory-interface'),
          getOptions: (list: GPUType[]) =>
            [...new Set(list.map((item) => item.memory_bus))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
      ],
      [ProductEnum.RAM]: [
        {
          type: 'select',
          key: 'capacity',
          label: t('ram-capacity'),
          getOptions: (list: RAMType[]) => {
            const sizes = [
              ...new Set(list.map((item) => item.capacity)),
            ].filter(
              (size): size is number => typeof size === 'number' && !isNaN(size)
            )
            return sizes
              .sort((a, b) => a - b)
              .map((value) => ({ value, label: formatNormalCapacity(value) }))
          },
        },
      ],
      [ProductEnum.Motherboard]: [
        {
          type: 'select',
          key: 'form_factor',
          label: t('form-factor'),
          getOptions: (list: MotherboardType[]) =>
            [...new Set(list.map((item) => item.form_factor))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
        {
          type: 'select',
          key: 'chipset',
          label: t('chipset'),
          getOptions: (list: MotherboardType[]) =>
            [...new Set(list.map((item) => item.chipset))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
        {
          type: 'select',
          key: 'memory_type',
          label: t('memory-type'),
          getOptions: (list: MotherboardType[]) =>
            [...new Set(list.map((item) => item.ram_type))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
        {
          type: 'select',
          key: 'wireless',
          label: t('wireless'),
          getOptions: (_list: MotherboardType[]) => {
            return [
              { value: 1, label: t('yes') },
              { value: 0, label: t('no') },
            ]
          },
        },
      ],
      [ProductEnum.SSD]: [
        {
          type: 'select',
          key: 'capacity',
          label: t('capacity'),
          getOptions: (list: SSDType[]) => {
            const sizes = [
              ...new Set(list.map((item) => item.capacity)),
            ].filter(
              (size): size is number => typeof size === 'number' && !isNaN(size)
            )
            return sizes
              .sort((a, b) => a - b)
              .map((value) => ({ value, label: formatSSDCapacity(value) }))
          },
        },
        {
          type: 'select',
          key: 'interface',
          label: t('interface'),
          getOptions: (list: SSDType[]) =>
            [...new Set(list.map((item) => item.interface))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
      ],
      [ProductEnum.PSU]: [
        {
          type: 'select',
          key: 'efficiency',
          label: t('efficiency'),
          getOptions: (list: PSUType[]) =>
            [...new Set(list.map((item) => item.efficiency))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
        {
          type: 'select',
          key: 'size',
          label: t('size'),
          getOptions: (list: PSUType[]) =>
            [...new Set(list.map((item) => item.size))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
        {
          type: 'range',
          key: 'wattage',
          label: t('psu-wattage'),
          getRange: (list: PSUType[]) => ({
            min: Math.min(...list.map((item) => item.wattage || 0)),
            max: Math.max(...list.map((item) => item.wattage || 0)),
          }),
        },
      ],
      [ProductEnum.ComputerCase]: [
        {
          type: 'select',
          key: 'case_size',
          label: t('case-size'),
          getOptions: (list: CaseType[]) =>
            [...new Set(list.map((item) => item.case_size))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: value })),
        },
      ],
      [ProductEnum.Cooler]: [
        {
          type: 'select',
          key: 'is_liquid_cooler',
          label: t('is-liquid-cooler'),
          getOptions: (_list: CoolerType[]) => {
            return [
              { value: 1, label: t('yes') },
              { value: 0, label: t('no') },
            ]
          },
        },
        {
          type: 'select',
          key: 'liquid_cooler_size',
          label: t('liquid-cooler-size'),
          getOptions: (list: CoolerType[]) =>
            [...new Set(list.map((item) => item.liquid_cooler_size))]
              .filter(Boolean)
              .sort()
              .map((value) => ({ value, label: lengthLabelHandler(value) })),
        },
      ],
      // 添加其他硬體類型配置...
    }),
    [t]
  )

  // 獲取當前硬體類型的數據列表
  const currentList = useMemo(() => {
    const dataMap: Record<ProductEnum, any[]> = {
      [ProductEnum.CPU]: dataState.cpuList,
      [ProductEnum.GPU]: dataState.gpuList,
      [ProductEnum.Motherboard]: dataState.motherboardList,
      [ProductEnum.RAM]: dataState.ramList,
      [ProductEnum.SSD]: dataState.ssdList,
      [ProductEnum.PSU]: dataState.psuList,
      [ProductEnum.ComputerCase]: dataState.caseList,
      [ProductEnum.Cooler]: dataState.coolerList,
    }
    return dataMap[selectedType] || []
  }, [selectedType, dataState])

  // 生成特定過濾器元件
  const renderSpecificFilters = useMemo(() => {
    const config = specificFilterConfig[selectedType] || []
    return config.map((filter: any) => {
      switch (filter.type) {
        case 'range': {
          const range = filter.getRange(currentList)
          return (
            <Box paddingY={1} key={filter.key}>
              <RangeSlider
                min={range.min}
                max={range.max}
                label={filter.label}
                defaultValue={[range.min, range.max]}
                inputLayout="below"
                onChange={(value) =>
                  setSpecificFilters((prev) => ({
                    ...prev,
                    [filter.key]: value,
                  }))
                }
              />
            </Box>
          )
        }
        case 'select': {
          const options = filter.getOptions(currentList)
          return (
            <Box paddingY={1} key={filter.key}>
              <CustomAutocomplete
                key={filter.key}
                options={options.map((opt: any) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                label={filter.label}
                onChange={(_, value) =>
                  setSpecificFilters((prev) => ({
                    ...prev,
                    [filter.key]: value?.value || null,
                  }))
                }
              />
            </Box>
          )
        }
        default:
          return null
      }
    })
  }, [selectedType, currentList])

  // 通用列表筛选逻辑
  const filterList = (list: any[]) => {
    return list.filter((item) => {
      // 原有品牌和價格篩選
      const brandMatch = !selectedBrand || item.brand === selectedBrand
      const price = getLocalizedPriceNum(item)
      const priceMatch = price >= selectedPrice[0] && price <= selectedPrice[1]

      // 新增：特定條件篩選
      const specificFilter = specificFilterConfig[selectedType] || []
      const specificMatch = specificFilter.every(({ key, type }) => {
        const filterValue = specificFilters[key]
        if (!filterValue) return true // 未設置篩選條件時跳過

        switch (type) {
          case 'range':
            return item[key] >= filterValue[0] && item[key] <= filterValue[1]
          case 'select':
            return item[key] === filterValue
          default:
            return true
        }
      })
      return brandMatch && priceMatch && specificMatch
    })
  }

  return (
    <Box className="main-container" sx={{ width: '90%' }}>
      <Grid
        container
        spacing={2}
        size={{ xs: 12, md: 8 }}
        paddingX={{ xs: 0, lg: 12 }}
        width={{ xs: '100%' }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Grid container direction="column" spacing={1} paddingTop={2}>
            <Grid size={12}>
              <SegmentedTabs
                value={selectedType}
                onChange={updateType}
                tabs={tabs}
                orientation="vertical"
                sx={{
                  width: 'auto',
                }}
              />
            </Grid>
            <Grid size={12}>
              <Box paddingY={1}>
                <CustomAutocomplete
                  options={brandOptions}
                  value={
                    selectedBrand
                      ? { label: selectedBrand, value: selectedBrand }
                      : null
                  }
                  label={t('filter-by-brand')}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  onChange={(_, newValue) =>
                    setSelectedBrand(newValue?.value || null)
                  }
                  disabled={dataState.isLoading}
                  renderOption={(props, option) => (
                    <li {...props} style={{ padding: '8px 16px' }}>
                      {option.label}
                    </li>
                  )}
                />
              </Box>
              <Box paddingY={1}>
                <RangeSlider
                  min={minPrice}
                  max={maxPrice}
                  defaultValue={priceRange}
                  inputLayout="below"
                  onChange={handlePriceChange}
                />
              </Box>
              {renderSpecificFilters}
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 9 }} sx={{ paddingTop: '24px' }}>
          {createSelectLogic(selectedType)}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Database
