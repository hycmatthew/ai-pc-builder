import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, Stack, Typography } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import AOS from 'aos'
import 'aos/dist/aos.css'

import { RAMType } from '../../../constant/objectTypes'
import { getSelectedCurrency, stringToNumberWithDP } from '../../../utils/NumberHelper'
import { ramPerformanceLogic } from '../../../logic/performanceLogic'
import { generateRAMName, priceLabelHandler } from '../../../utils/LabelHelper'
import BarMotion from '../../../styles/animation/BarMotion'
import BenchmarksDataGrid from './BenchmarksDataGrid'
import { getGradientColor } from '../../../utils/ColorHelper'

function RAMBenchmarksTable() {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState('speed')

  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  useEffect(() => {
    AOS.init({
      duration: 2000,
      mirror: false,
    })
  }, [])

  const benchmarksBarWidth = (type: string, score: number, index: number) => {
    const maxWidth = 400
    const setLength = score / 7000

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
      width: 370,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'speed',
      headerName: t('ram-frequency'),
      width: 120,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'cl',
      headerName: t('ram-latency'),
      width: 150,
      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'performance',
      headerName: t('overall-performance'),
      width: 380,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Stack direction="row" alignItems="center" spacing={2}>
            {benchmarksBarWidth(params.field, params.value, params.row.index)}
            <Typography variant="subtitle2">{params.value}</Typography>
          </Stack>
        )
      },
    },
    {
      field: 'price',
      headerName: t('price'),
      width: 110,
      editable: false,
      disableColumnMenu: true,
      renderCell: (params) => priceLabelHandler(params.value)
    },
  ]

  const createListOptions = () => {
    let tempOptions: any[] = []
    tempOptions = dataState.ramList.map((item: RAMType, index: number) => {
      return {
        id: generateRAMName(item),
        index,
        speed: item.Speed,
        performance: ramPerformanceLogic(item),
        cl: item.Timing,
        price: stringToNumberWithDP(item[getSelectedCurrency()]),
      }
    })
    return tempOptions.sort((a, b) => b.performance - a.performance)
  }

  const handleColumnHeaderClick = (fieldName: string) => {
    if (fieldName === 'speed' || fieldName === 'cl' || fieldName === 'performance') {
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

export default RAMBenchmarksTable
