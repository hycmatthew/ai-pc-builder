import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid2 as Grid } from '@mui/material'

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

const Database = () => {
  const { t } = useTranslation()
  const tabs = [
    { label: t('cpu'), value: ProductEnum.CPU },
    { label: t('motherboard'), value: ProductEnum.Motherboard },
    { label: t('gpu'), value: ProductEnum.GPU },
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
    const brands = [...new Set(currentList.map((item: any) => item.Brand))]
      .filter(Boolean)
      .sort()

    return brands.map((brand) => ({ label: brand, value: brand }))
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
  }, [selectedType])

  const updateType = (event: React.SyntheticEvent, newValue: any) => {
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
      [ProductEnum.GPU]: [
        {
          type: 'select',
          key: 'Manufacturer',
          label: t('manufacturer'),
          getOptions: (list: any[]) =>
            [...new Set(list.map((item) => item.Manufacturer))]
              .filter(Boolean)
              .sort(),
        },
        {
          type: 'select',
          key: 'Chipset',
          label: t('chipset'),
          getOptions: (list: any[]) =>
            [...new Set(list.map((item) => item.Chipset))]
              .filter(Boolean)
              .sort(),
        },
        {
          type: 'select',
          key: 'MemorySize',
          label: t('memory-size'),
          getOptions: (list: any[]) => {
            const sizes = [
              ...new Set(list.map((item) => item.MemorySize)),
            ].filter(
              (size): size is number => typeof size === 'number' && !isNaN(size)
            )

            return sizes.sort((a, b) => a - b)
          },
        },
      ],
      [ProductEnum.RAM]: [
        {
          type: 'range',
          key: 'Capacity',
          label: t('capacity'),
          getRange: (list: any[]) => ({
            min: Math.min(...list.map((item) => item.Capacity || 0)),
            max: Math.max(...list.map((item) => item.Capacity || 0)),
          }),
        },
      ],
      [ProductEnum.Motherboard]: [
        {
          type: 'select',
          key: 'FormFactor',
          label: t('form-factor'),
          getOptions: (list: any[]) =>
            [...new Set(list.map((item) => item.FormFactor))]
              .filter(Boolean)
              .sort(),
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
                  label: opt,
                  value: opt,
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
      const brandMatch = !selectedBrand || item.Brand === selectedBrand
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
    <Grid container justifyContent="center">
      <Grid container spacing={2} size={{ xs: 12, md: 8 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Grid container direction="column" spacing={1}>
            <Grid size={12}>
              <SegmentedTabs
                value={selectedType}
                onChange={updateType}
                tabs={tabs}
                orientation="vertical"
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
        <Grid size={{ xs: 6, md: 9 }} sx={{ paddingTop: '24px' }}>
          {createSelectLogic(selectedType)}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Database
