import { useEffect } from 'react'
import { Unstable_Grid2 as Grid } from '@mui/material'

import SelectElement from '../../common/components/SelectElement'
import { DataState, sliceActions } from '../../../store/rawDataReducer'
import { useAppDispatch } from '../../../store/store'
import ProductEnum from '../../../constant/ProductEnum'
import {
  generateAIOSelectElement,
  generateCaseSelectElement,
  generateCPUSelectElement,
  generateGPUSelectElement,
  generateMotherboardSelectElement,
  generateSSDSelectElement,
  generatePSUSelectElement,
  generateRAMSelectElement,
  generateAirCoolerSelectElement,
} from '../../common/utils/generateSelectElements'
import {
  searchCPUItem,
  searchMotherboardItem,
  searchGPUItem,
  searchRAMItem,
  searchSSDItem,
  searchPSUItem,
  searchCaseItem,
  searchAIOItem,
  searchAirCoolerItem,
} from '../../common/utils/searchItemLogic'

type ComponentMenuProps = {
  dataState: DataState
}

const ComponentMenu = ({ dataState }: ComponentMenuProps) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(sliceActions.clearSelectedItem())
  }, [dispatch])

  const {
    selectedItems,
    cpuList,
    gpuList,
    motherboardList,
    ramList,
    ssdList,
    psuList,
    caseList,
    aioList,
    airCoolerList,
    isLoading,
  } = dataState

  const changeSelectItem = (value: string, type: string) => {
    switch (type) {
      case ProductEnum.CPU: {
        const selectedItem = searchCPUItem(cpuList, value)
        dispatch(sliceActions.updateSelectedCPU(selectedItem))
        break
      }
      case ProductEnum.Motherboard: {
        const selectedItem = searchMotherboardItem(motherboardList, value)
        dispatch(sliceActions.updateSelectedMotherboard(selectedItem))
        break
      }
      case ProductEnum.GPU: {
        const selectedItem = searchGPUItem(gpuList, value)
        dispatch(sliceActions.updateSelectedGPU(selectedItem))
        break
      }
      case ProductEnum.RAM: {
        const selectedItem = searchRAMItem(ramList, value)
        dispatch(sliceActions.updateSelectedRAM(selectedItem))
        break
      }
      case ProductEnum.SSD: {
        const selectedItem = searchSSDItem(ssdList, value)
        dispatch(sliceActions.updateSelectedSSD(selectedItem))
        break
      }
      case ProductEnum.PSU: {
        const selectedItem = searchPSUItem(psuList, value)
        dispatch(sliceActions.updateSelectedPSU(selectedItem))
        break
      }
      case ProductEnum.ComputerCase: {
        const selectedItem = searchCaseItem(caseList, value)
        dispatch(sliceActions.updateSelectedCase(selectedItem))
        break
      }
      case ProductEnum.AIO: {
        const selectedItem = searchAIOItem(aioList, value)
        dispatch(sliceActions.updateSelectedAIO(selectedItem))
        break
      }
      case ProductEnum.AirCooler: {
        const selectedItem = searchAirCoolerItem(airCoolerList, value)
        dispatch(sliceActions.updateSelectedAirCooler(selectedItem))
        break
      }
      default:
        break
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.CPU}
          options={generateCPUSelectElement(cpuList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.GPU}
          options={generateGPUSelectElement(gpuList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.Motherboard}
          options={generateMotherboardSelectElement(
            motherboardList,
            selectedItems
          )}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.RAM}
          options={generateRAMSelectElement(ramList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.SSD}
          options={generateSSDSelectElement(ssdList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.PSU}
          options={generatePSUSelectElement(psuList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.ComputerCase}
          options={generateCaseSelectElement(caseList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.AIO}
          options={generateAIOSelectElement(aioList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.AirCooler}
          options={generateAirCoolerSelectElement(airCoolerList, selectedItems)}
          selectChange={changeSelectItem}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  )
}
export default ComponentMenu
