import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Box } from '@mui/material'
import { Unstable_Grid2 as Grid } from '@mui/material'

import { useSelector } from 'react-redux'
import ItemInfoTable from '../components/ItemInfoTable'
import ProductEnum from '../../../constant/ProductEnum'
import CPUSuggestion from '../components/CPUSuggestion'
import GPUSuggestion from '../components/GPUSuggestion'
import MotherboardSuggestion from '../components/MotherboardSuggestion'
import RAMSuggestion from '../components/RAMSuggestion'
import SSDSuggestion from '../components/SSDSuggestion'
import PSUSuggestion from '../components/PSUSuggestion'
import CaseSuggestion from '../components/CaseSuggestion'
import AIOSuggestion from '../components/AIOSuggestion'
import AirCoolerSuggestion from '../components/AirCoolerSuggestion'

function Database() {
  const { t } = useTranslation()
  const categoryList = Object.values(ProductEnum).filter(
    (item) => item !== ProductEnum.AirCooler
  )

  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  const [selectedType, setSelectedType] = useState(ProductEnum.CPU)

  const createSelectLogic = (type: string) => {
    switch (type) {
      case ProductEnum.CPU:
        return (
          <CPUSuggestion
            cpuList={dataState.cpuList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.GPU:
        return (
          <GPUSuggestion
            gpuList={dataState.gpuList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.Motherboard:
        return (
          <MotherboardSuggestion
            motherboardList={dataState.motherboardList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.RAM:
        return (
          <RAMSuggestion
            ramList={dataState.ramList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.SSD:
        return (
          <SSDSuggestion
            ssdList={dataState.ssdList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.PSU:
        return (
          <PSUSuggestion
            psuList={dataState.psuList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.ComputerCase:
        return (
          <CaseSuggestion
            caseList={dataState.caseList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.AIO:
        return (
          <AIOSuggestion
            aioList={dataState.aioList}
            isLoading={dataState.isLoading}
          />
        )
      case ProductEnum.AirCooler:
        return (
          <AirCoolerSuggestion
            airCoolerList={dataState.airCoolerList}
            isLoading={dataState.isLoading}
          />
        )
      default:
        return ''
    }
  }

  return (
    <Grid justifyContent="center" container>
      <Grid container xs={12} md={8} justifyContent="center" spacing={2}>
        {categoryList.map((item) => (
          <Grid>
            <Box component="span">
              <Button variant="outlined" onClick={() => setSelectedType(item)}>
                {t(item)}
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        xs={12}
        md={8}
        justifyContent="center"
        sx={{ paddingTop: '24px' }}
      >
        <Grid xs={12}>{createSelectLogic(selectedType)}</Grid>
      </Grid>
      <Grid
        container
        xs={12}
        md={8}
        justifyContent="center"
        sx={{ paddingTop: '24px' }}
      >
        <Grid xs={12}>
          <ItemInfoTable />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Database
