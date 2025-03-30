import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, Stack } from '@mui/material'
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

function CPUBenchmarksTable() {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState('multiScore')

  const barWidthShort = 120
  const barWidthLong = 450

  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  const benchmarksBarWidth = (type: string, score: number) => {
    const maxWidth = 360
    const maxSingleScore = 3000
    const maxMultiScore = 45000
    let setLength = 1

    switch (type) {
      case 'singleScore':
        setLength = score / maxSingleScore
        break
      default:
        setLength = score / maxMultiScore
        break
    }
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
  }

  const columns: ColumnType[] = [
    {
      field: 'id',
      headerName: t('name'),
      width: 220,
    },
    {
      field: 'singleScore',
      headerName: t('cpu-single-score'),
      width: selectedField === 'singleScore' ? barWidthLong : barWidthShort,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            {params.field === selectedField
              ? benchmarksBarWidth(params.field, params.value)
              : ''}
            <CusTypography variant="h6">{params.value}</CusTypography>
          </Stack>
        )
      },
    },
    {
      field: 'multiScore',
      headerName: t('cpu-multi-score'),
      width: selectedField === 'multiScore' ? barWidthLong : barWidthShort,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            {params.field === selectedField
              ? benchmarksBarWidth(params.field, params.value)
              : ''}
            <CusTypography variant="h6">{params.value}</CusTypography>
          </Stack>
        )
      },
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
  ]

  const createListOptions = () => {
    let tempOptions: any[] = []
    tempOptions = dataState.cpuList.map((item: CPUType, index: number) => {
      return {
        id: generateItemName(item.Brand, item.Name),
        index,
        singleScore: item.SingleCoreScore,
        multiScore: item.MultiCoreScore,
        pricePerformance: calculatePricePerformance(item.MultiCoreScore, getCurrentPriceNum(item)),
        price: getCurrentPriceNum(item),
      }
    })
    return tempOptions.sort((a, b) => b.multiScore - a.multiScore)
  }

  const handleColumnHeaderClick = (fieldName: string) => {
    console.log(fieldName)
    if (fieldName === 'singleScore' || fieldName === 'multiScore') {
      setSelectedField(fieldName)
    }
  }

  return (
    <BenchmarksDataGrid
      rows={createListOptions()}
      columns={columns}
      headerClick={handleColumnHeaderClick}
    />
  )
}

export default CPUBenchmarksTable
