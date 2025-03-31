import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, LinearProgress, Stack } from '@mui/material'
import CPUType from '../../../constant/objectTypes/CPUType'
import {
  addCurrencySign,
  normalizeNumberWithDP,
  calculatePricePerformance,
  getCurrentPriceNum,
} from '../../../utils/NumberHelper'
import { generateItemName } from '../../../utils/LabelHelper'
import BarMotion from '../../../styles/animation/BarMotion'
import BenchmarksDataGrid from './BenchmarksDataGrid'
import { getGradientColor } from '../../../utils/ColorHelper'
import CusTypography from '../../common/components/CusTypography'
import { ColumnType } from '../../common/components/DataGrid'
import { FilterPanel } from './FilterPanel'

export type BaseDataItemType = {
  id: string
  brand: string
  name: string
  singleScore: number
  multiScore: number
  price: number
  pricePerformance: number
}

function CPUBenchmarksTable() {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState('multiScore')
  const [filters, setFilters] = useState({
    nameFilter: '',
    priceRange: [0, 1000] as [number, number],
  })

  const dataState = useSelector((state: any) => state.rawData)

  // 生成基础数据并缓存
  const baseData = useMemo(() => {
    return dataState.cpuList.map((item: CPUType) => ({
      id: generateItemName(item.Brand, item.Name),
      brand: item.Brand,
      name: item.Name,
      singleScore: item.SingleCoreScore,
      multiScore: item.MultiCoreScore,
      price: getCurrentPriceNum(item),
      pricePerformance: calculatePricePerformance(
        item.MultiCoreScore,
        getCurrentPriceNum(item)
      ),
    }))
  }, [dataState.cpuList])

  const [isMaxPriceUpdate, setIsMaxPriceUpdate] = useState(false)
  const minPrice = 0
  const maxPrice = Math.max(
    ...baseData.map((item: BaseDataItemType) =>
      isFinite(item.price) ? item.price : 0
    )
  )

  useEffect(() => {
    if (!isMaxPriceUpdate) {
      // 只有未修改时才自动更新
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
      .filter((item: BaseDataItemType) => {
        const matchesName = item.id
          .toLowerCase()
          .includes(filters.nameFilter.toLowerCase())
        const matchesPrice =
          item.price >= filters.priceRange[0] &&
          item.price <= filters.priceRange[1]
        return matchesName && matchesPrice
      })
      .sort(
        (a: BaseDataItemType, b: BaseDataItemType) =>
          b.multiScore - a.multiScore
      )
  }, [baseData, filters])

  // 柱状图生成逻辑
  const benchmarksBarWidth = useCallback((type: string, score: number) => {
    const maxWidth = 360
    const maxSingleScore = 3000
    const maxMultiScore = 45000
    const setLength =
      type === 'singleScore' ? score / maxSingleScore : score / maxMultiScore

    return (
      <BarMotion>
        <Box
          sx={{
            width: setLength * maxWidth,
            backgroundColor: getGradientColor('#006bd6', '#ff0000', setLength),
            height: 16,
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
        width: 220,
        renderCell: (params) => (
          <CusTypography variant="h6">{params.value}</CusTypography>
        ),
      },
      {
        field: 'singleScore',
        headerName: t('cpu-single-score'),
        width: selectedField === 'singleScore' ? 450 : 120,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            {params.field === selectedField &&
              benchmarksBarWidth(params.field, params.value)}
            <CusTypography variant="h6">{params.value}</CusTypography>
          </Stack>
        ),
      },
      {
        field: 'multiScore',
        headerName: t('cpu-multi-score'),
        width: selectedField === 'multiScore' ? 450 : 120,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center" spacing={2}>
            {params.field === selectedField &&
              benchmarksBarWidth(params.field, params.value)}
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
        width: 120,
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
    if (['singleScore', 'multiScore'].includes(fieldName)) {
      setSelectedField(fieldName)
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
            nameFilter={filters.nameFilter}
            priceRange={filters.priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
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

export default CPUBenchmarksTable
