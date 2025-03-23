import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid2 as Grid } from '@mui/material'

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
import CoolerSuggestion from '../components/CoolerSuggestion'
import DatabaseTabButton from '../../common/components/DatabaseTabButton'

function Database() {
  const { t } = useTranslation()

  const categoryList = Object.values(ProductEnum)

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
      case ProductEnum.Cooler:
        return (
          <CoolerSuggestion
            coolerList={dataState.coolerList}
            isLoading={dataState.isLoading}
          />
        )
      /*
      case ProductEnum.Fan:
        return (
          <FanSuggestion
            airCoolerList={dataState.airCoolerList}
            isLoading={dataState.isLoading}
          />
        )
          */
      default:
        return ''
    }
  }

  return (
    <Grid justifyContent="center" container>
      <Grid
        container
        size={{ xs: 12, md: 8 }}
        justifyContent="center"
        spacing={1}
      >
        {categoryList.map((item) => (
          <Grid size={{ xs: 6, md: 3 }}>
            <DatabaseTabButton
              label={item}
              isSelected={item === selectedType}
              clickedFunc={() => setSelectedType(item)}
            />
          </Grid>
        ))}
      </Grid>
      <Grid
        container
        size={{ xs: 12, md: 8 }}
        justifyContent="center"
        sx={{ paddingTop: '24px' }}
      >
        <Grid size={12}>{createSelectLogic(selectedType)}</Grid>
      </Grid>
      <Grid
        container
        size={{ xs: 12, md: 8 }}
        justifyContent="center"
        sx={{ paddingTop: '24px' }}
      >
        <Grid size={12}>
          <ItemInfoTable />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Database
