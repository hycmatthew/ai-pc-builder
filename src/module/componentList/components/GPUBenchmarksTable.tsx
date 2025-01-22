import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, Stack, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './BenchmarksTable.scss'

import GPUType from '../../../constant/objectTypes/GPUType'
import {
  getSelectedCurrency,
  stringToNumberWithDP,
} from '../../../utils/NumberHelper'
import { generateItemName, priceLabelHandler } from '../../../utils/LabelHelper'
import BarMotion from '../../../styles/animation/BarMotion'
import BenchmarksDataGrid from './BenchmarksDataGrid'
import { getGradientColor } from '../../../utils/ColorHelper'

function GPUBenchmarksTable() {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState('timespyScore')

  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  useEffect(() => {
    AOS.init({
      duration: 2000,
    })
  }, [])

  const benchmarksBarWidth = (type: string, score: number) => {
    const maxWidth = 400
    const maxTimeScore = 45000
    const maxFireScore = 50000
    let setLength = 1

    switch (type) {
      case 'timespyScore':
        setLength = score / maxTimeScore
        break
      default:
        setLength = score / maxFireScore
        break
    }
    return (
      <BarMotion>
        <Box
          sx={{
            width: setLength * maxWidth,
            backgroundColor: getGradientColor('#006bd6', '#ff0000', setLength),
            borderRadius: 0,
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
      width: 350,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'timespyScore',
      headerName: 'Time Spy Score',
      width: selectedField === 'timespyScore' ? 450 : 150,
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
      field: 'firestrikeScore',
      headerName: 'Fire Strike Score',
      width: selectedField === 'firestrikeScore' ? 450 : 150,
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
      field: 'price',
      headerName: t('price'),
      width: 160,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => priceLabelHandler(params.value),
    },
  ]

  const createListOptions = () => {
    let tempOptions: any[] = []
    tempOptions = dataState.gpuList.map((item: GPUType, index: number) => {
      return {
        id: generateItemName(item.Brand, item.Name),
        index,
        benchmark: item.Benchmark,
        price: stringToNumberWithDP(item[getSelectedCurrency()]),
      }
    })
    return tempOptions.sort((a, b) => b.timespyScore - a.timespyScore)
  }

  const handleColumnHeaderClick = (fieldName: string) => {
    if (fieldName === 'timespyScore' || fieldName === 'firestrikeScore') {
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

export default GPUBenchmarksTable
