import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, Stack, Typography } from '@mui/material'
import 'aos/dist/aos.css'
import './BenchmarksTable.scss'

import { RAMType } from '../../../constant/objectTypes'
import { convertLocalizedPrice, normalizeNumberWithDP } from '../../../utils/NumberHelper'
import { ramPerformanceLogic } from '../../../logic/performanceLogic'
import { generateRAMName, priceLabelHandler } from '../../../utils/LabelHelper'
import BarMotion from '../../../styles/animation/BarMotion'
import BenchmarksDataGrid from './BenchmarksDataGrid'
import { getGradientColor } from '../../../utils/ColorHelper'
import { ColumnType } from '../../common/components/DataGrid'

function RAMBenchmarksTable() {
  const { t } = useTranslation()
  const [selectedField, setSelectedField] = useState('speed')

  const dataState = useSelector((state: any) => {
    return state.rawData
  })

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

  const columns: ColumnType[] = [
    {
      field: 'id',
      headerName: t('name'),
      sortable: false,
      width: 370,
    },
    {
      field: 'speed',
      headerName: t('ram-frequency'),
      width: 100,
    },
    {
      field: 'cl',
      headerName: t('ram-latency'),
      width: 150,
    },
    {
      field: 'performance',
      headerName: t('overall-performance'),
      width: 300,
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
      renderCell: (params) => priceLabelHandler(params.value)
    },
  ]

  const createListOptions = () => {
    let tempOptions: any[] = []
    tempOptions = dataState.ramList.map((item: RAMType, index: number) => {
      return {
        id: generateRAMName(item),
        index,
        speed: item.speed,
        performance: ramPerformanceLogic(item),
        cl: item.latency,
        price: normalizeNumberWithDP(convertLocalizedPrice(item)),
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
