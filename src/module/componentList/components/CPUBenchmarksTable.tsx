import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, Stack, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import CPUType from '../../../constant/objectTypes/CPUType'
import {
  getSelectedCurrency,
  stringToNumber,
  stringToNumberWithDP,
} from '../../../utils/NumberHelper'
import { generateItemName, priceLabelHandler } from '../../../utils/LabelHelper'
import BarMotion from '../../../styles/animation/BarMotion'
import BenchmarksDataGrid from './BenchmarksDataGrid'
import { getGradientColor } from '../../../utils/ColorHelper'

function CPUBenchmarksTable() {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState('multiScore')

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
            backgroundColor: getGradientColor('#00e673', '#ff0000', setLength),
            borderRadius: 3,
            height: 12,
          }}
        />
      </BarMotion>
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('name'),
      sortable: false,
      width: 220,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'singleScore',
      headerName: t('cpu-single-score'),
      width: selectedField === 'singleScore' ? 400 : 200,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            {params.field === selectedField
              ? benchmarksBarWidth(params.field, params.value)
              : ''}
            <Typography variant="subtitle2">{params.value}</Typography>
          </Stack>
        )
      },
    },
    {
      field: 'multiScore',
      headerName: t('cpu-multi-score'),
      width: selectedField === 'multiScore' ? 400 : 200,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            {params.field === selectedField
              ? benchmarksBarWidth(params.field, params.value)
              : ''}
            <Typography variant="subtitle2">{params.value}</Typography>
          </Stack>
        )
      },
    },
    {
      field: 'pricePerformance',
      headerName: t('price-performance'),
      width: 150,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => (Number.isFinite(Number(params.value)) ? Number(params.value).toFixed(2) : '-'),
    },
    {
      field: 'price',
      headerName: t('price'),
      width: 150,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => priceLabelHandler(params.value),
    },
  ]

  const createListOptions = () => {
    let tempOptions: any[] = []
    tempOptions = dataState.cpuList.map((item: CPUType, index: number) => {
      return {
        id: generateItemName(item.brand, item.name),
        index,
        singleScore: item.singleCoreScore,
        multiScore: item.multiCoreScore,
        pricePerformance:
          item.multiCoreScore / stringToNumber(item[getSelectedCurrency()]),
        price: stringToNumberWithDP(item[getSelectedCurrency()]),
      }
    })
    return tempOptions.sort((a, b) => b.multiScore - a.multiScore)
  }

  const handleColumnHeaderClick = (fieldName: string) => {
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
