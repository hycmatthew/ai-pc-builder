import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, LinearProgress, Stack, Typography } from '@mui/material'
import 'aos/dist/aos.css'
import './BenchmarksTable.scss'

import GPUType from '../../../constant/objectTypes/GPUType'
import {
  addCurrencySign,
  calculatePricePerformance,
  getLocalizedPriceNum,
  normalizeNumberWithDP,
} from '../../../utils/NumberHelper'
import { generateItemName } from '../../../utils/LabelHelper'
import BarMotion from '../../../styles/animation/BarMotion'
import BenchmarksDataGrid from './BenchmarksDataGrid'
import { getGradientColor } from '../../../utils/ColorHelper'
import { ColumnType } from '../../common/components/DataGrid'
import CusTypography from '../../common/components/CusTypography'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { FilterPanel } from './FilterPanel'

export type GPUBaseDataItemType = {
  id: string
  brand: string
  name: string
  timespyScore: number
  pricePerformance: number
  price: number
}

function GPUBenchmarksTable() {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState<
    'timespyScore' | 'fireStrikeScore'
  >('timespyScore')
  const [filters, setFilters] = useState({
    brandFilter: '',
    nameFilter: '',
    priceRange: [0, 1000] as [number, number],
  })
  const [isMaxPriceUpdate, setIsMaxPriceUpdate] = useState(false)

  const dataState = useSelector((state: any) => state.rawData)

  // 生成基础数据并缓存
  const baseData = useMemo(() => {
    return dataState.gpuList.map((item: GPUType) => ({
      id: generateItemName(item.brand, item.name),
      brand: item.brand,
      name: item.name,
      timespyScore: item.benchmark,
      price: getLocalizedPriceNum(item),
      pricePerformance: calculatePricePerformance(
        item.benchmark,
        getLocalizedPriceNum(item)
      ),
    }))
  }, [dataState.gpuList])

  // 获取唯一品牌列表
  const uniqueBrands = useMemo(() => {
    const brands: string = baseData.map(
      (item: GPUBaseDataItemType) => item.brand
    )
    return Array.from(new Set(brands))
  }, [baseData])

  // 价格范围计算
  const minPrice = 0
  const maxPrice = Math.max(
    ...baseData.map((item: GPUBaseDataItemType) =>
      isFinite(item.price) ? item.price : 0
    )
  )

  // 自动更新价格范围
  useEffect(() => {
    if (!isMaxPriceUpdate) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [minPrice, maxPrice],
      }))
      setIsMaxPriceUpdate(true)
    }
  }, [minPrice, maxPrice])

  // 过滤后的数据
  const filteredData = useMemo(() => {
    return baseData
      .filter((item: GPUBaseDataItemType) => {
        const matchesBrand =
          filters.brandFilter === '' || item.brand === filters.brandFilter
        const matchesName = item.id
          .toLowerCase()
          .includes(filters.nameFilter.toLowerCase())
        const matchesPrice =
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1]
        return matchesBrand && matchesName && matchesPrice
      })
      .sort(
        (a: GPUBaseDataItemType, b: GPUBaseDataItemType) =>
          b.timespyScore - a.timespyScore
      )
  }, [baseData, filters])

  // 柱状图生成逻辑（使用 useCallback 优化）
  const benchmarksBarWidth = useCallback((type: string, score: number) => {
    const maxWidth = 400
    const maxScores = {
      timespyScore: 45000,
      fireStrikeScore: 50000,
    }

    const setLength = score / maxScores[type as keyof typeof maxScores]
    return (
      <BarMotion>
        <Box
          sx={{
            width: setLength * maxWidth,
            backgroundColor: getGradientColor('#006bd6', '#ff0000', setLength),
            height: 12,
          }}
        />
      </BarMotion>
    )
  }, [])

  // 列定义
  const columns: ColumnType[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: t('name'),
        width: 350,
        renderCell: (params) => (
          <CusTypography variant="h6">{params.value}</CusTypography>
        ),
      },
      {
        field: selectedField,
        headerName: t('benchmark'),
        width: selectedField === 'timespyScore' ? 450 : 400,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            {benchmarksBarWidth(selectedField, params.value)}
            <CusTypography variant="h6">{params.value}</CusTypography>
          </Stack>
        ),
      },
      {
        field: 'pricePerformance',
        headerName: t('price-performance'),
        width: 120,
        renderCell: (params) => (
          <CusTypography variant="h6">
            {normalizeNumberWithDP(params.value)}
          </CusTypography>
        ),
      },
      {
        field: 'price',
        headerName: t('price'),
        width: 160,
        renderCell: (params) => (
          <CusTypography variant="h6">
            {addCurrencySign(params.value)}
          </CusTypography>
        ),
      },
    ],
    [t, selectedField, benchmarksBarWidth]
  )

  // 处理列头点击
  const handleColumnHeaderClick = useCallback((fieldName: string) => {
    if (['timespyScore', 'fireStrikeScore'].includes(fieldName)) {
      setSelectedField(fieldName as typeof selectedField)
    }
  }, [])

  // 处理过滤变化
  const handleFilterChange = useCallback(
    (newFilters: Partial<typeof filters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }))
    },
    []
  )

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
export default GPUBenchmarksTable
