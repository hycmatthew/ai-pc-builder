import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import 'aos/dist/aos.css'
import './BenchmarksTable.scss'

import { RAMType } from '../../../constant/objectTypes'
import { convertLocalizedPrice } from '../../../utils/NumberHelper'
import { ramPerformanceLogic } from '../../../logic/performanceLogic'
import { generateRAMName, priceLabelHandler } from '../../../utils/LabelHelper'
import BarMotion from '../../../styles/animation/BarMotion'
import BenchmarksDataGrid from './BenchmarksDataGrid'
import { getGradientColor } from '../../../utils/ColorHelper'
import { ColumnType } from '../../common/components/DataGrid'
import { FilterPanel } from './FilterPanel'

export type RamBaseDataItemType = {
  id: string
  brand: string
  name: string
  performance: number
  price: number
}

function RAMBenchmarksTable() {
  const { t } = useTranslation()
  const [_selectedField, setSelectedField] = useState('speed')

  const [filters, setFilters] = useState({
    brandFilter: '',
    nameFilter: '',
    priceRange: [0, 1000] as [number, number],
  })
  const [isMaxPriceUpdate, setIsMaxPriceUpdate] = useState(false)

  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  // 生成基础数据并缓存
  const baseData = useMemo(() => {
    return dataState.ramList.map((item: RAMType) => ({
      id: generateRAMName(item),
      brand: item.brand,
      name: item.name,
      speed: item.speed,
      latency: item.latency,
      performance: ramPerformanceLogic(item),
      price: convertLocalizedPrice(item), // 确保返回数字
    }))
  }, [dataState.ramList])

  // 获取唯一品牌列表
  const uniqueBrands = useMemo(() => {
    return Array.from(
      new Set(baseData.map((item: RamBaseDataItemType) => item.brand))
    ) as string[]
  }, [baseData])

  // 计算价格范围
  const minPrice = 0
  const maxPrice = useMemo(
    () =>
      Math.max(
        ...baseData.map((item: RamBaseDataItemType) =>
          isFinite(item.price) ? item.price : 0
        )
      ),
    [baseData]
  )

  // 自动更新价格范围
  useEffect(() => {
    if (!isMaxPriceUpdate && maxPrice > 0) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
      }))
      setIsMaxPriceUpdate(true)
    }
  }, [minPrice, maxPrice, isMaxPriceUpdate])

  // 过滤后的数据
  const filteredData = useMemo(() => {
    return baseData
      .filter((item: RamBaseDataItemType) => {
        const matchesBrand =
          filters.brandFilter === '' || item.brand === filters.brandFilter
        const matchesName = item.name
          .toLowerCase()
          .includes(filters.nameFilter.toLowerCase())
        const matchesPrice =
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1]

        return matchesBrand && matchesName && matchesPrice
      })
      .sort((a: RamBaseDataItemType, b: RamBaseDataItemType) => {
        return b.performance - a.performance // 默认按性能排序
      })
  }, [baseData, filters])

  // 柱状图生成逻辑（使用 useCallback 优化）
  const benchmarksBarWidth = useCallback((score: number) => {
    const maxWidth = 300
    const maxScores = 16000

    const setLength = score / maxScores
    return (
      <BarMotion>
        <Box
          sx={{
            width: setLength * maxWidth,
            backgroundColor: getGradientColor('#006bd6', '#ff0000', setLength),
            height: 16,
            borderRadius: 1,
          }}
        />
      </BarMotion>
    )
  }, [])

  const columns: ColumnType[] = [
    {
      field: 'id',
      headerName: t('name'),
      sortable: false,
      width: 380,
    },
    {
      field: 'speed',
      headerName: t('ram-frequency'),
      width: 100,
    },
    {
      field: 'latency',
      headerName: t('ram-latency'),
      width: 100,
    },
    {
      field: 'performance',
      headerName: t('overall-performance'),
      width: 400,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            {benchmarksBarWidth(params.value)}
            <Typography variant="subtitle2">{params.value}</Typography>
          </Stack>
        )
      },
    },
    {
      field: 'price',
      headerName: t('price'),
      width: 100,
      renderCell: (params) => priceLabelHandler(params.value),
    },
  ]
  // 处理过滤变化
  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
    },
    []
  )

  const handleColumnHeaderClick = (fieldName: string) => {
    if (
      fieldName === 'speed' ||
      fieldName === 'cl' ||
      fieldName === 'performance'
    ) {
      setSelectedField(fieldName)
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {isMaxPriceUpdate ? (
        <>
          <FilterPanel
            brands={uniqueBrands}
            brandFilter={filters.brandFilter}
            nameFilter={filters.nameFilter}
            priceRange={filters.priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onBrandFilterChange={(value) =>
              handleFilterChange({ brandFilter: value })
            }
            onNameFilterChange={(value) =>
              handleFilterChange({ nameFilter: value })
            }
            onPriceRangeChange={(range) =>
              handleFilterChange({ priceRange: [range[0] || 0, range[1] || 0] })
            }
          />
          <BenchmarksDataGrid
            rows={filteredData}
            columns={columns}
            headerClick={handleColumnHeaderClick}
          />
        </>
      ) : (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  )
}

export default RAMBenchmarksTable
