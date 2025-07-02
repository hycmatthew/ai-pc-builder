import { useEffect } from 'react'
import { Grid } from '@mui/material'
import { NotificationsProvider } from '@toolpad/core/useNotifications'

import SelectElement from '../../common/components/SelectElement'
import { DataState, sliceActions } from '../../../store/rawDataReducer'
import { useAppDispatch } from '../../../store/store'
import ProductEnum from '../../../constant/ProductEnum'
import {
  generateAIOSelectElement as generateCoolerSelectElement,
  generateCaseSelectElement,
  generateCPUSelectElement,
  generateGPUSelectElement,
  generateMotherboardSelectElement,
  generateSSDSelectElement,
  generatePSUSelectElement,
  generateRAMSelectElement,
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
} from '../../common/utils/searchItemLogic'
import { useLocation } from 'react-router-dom'

type ComponentMenuProps = {
  dataState: DataState
}

const ComponentMenu = ({ dataState }: ComponentMenuProps) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const {
    selectedItems,
    cpuList,
    gpuList,
    motherboardList,
    ramList,
    ssdList,
    psuList,
    caseList,
    coolerList,
  } = dataState

  useEffect(() => {
    if (cpuList.length > 0 && searchParams.get('cpu')) {
      changeSelectItem(searchParams.get('cpu') || '', ProductEnum.CPU)
    }
    if (gpuList.length > 0 && searchParams.get('gpu')) {
      changeSelectItem(searchParams.get('gpu') || '', ProductEnum.GPU)
    }
    if (motherboardList.length > 0 && searchParams.get('mb')) {
      changeSelectItem(searchParams.get('mb') || '', ProductEnum.Motherboard)
    }
    if (ramList.length > 0 && searchParams.get(ProductEnum.RAM)) {
      changeSelectItem(searchParams.get(ProductEnum.RAM) || '', ProductEnum.RAM)
    }
    if (ssdList.length > 0 && searchParams.get(ProductEnum.SSD)) {
      changeSelectItem(searchParams.get(ProductEnum.SSD) || '', ProductEnum.SSD)
    }
    if (psuList.length > 0 && searchParams.get(ProductEnum.PSU)) {
      changeSelectItem(searchParams.get(ProductEnum.PSU) || '', ProductEnum.PSU)
    }
    if (caseList.length > 0 && searchParams.get('pcCase')) {
      changeSelectItem(
        searchParams.get('pcCase') || '',
        ProductEnum.ComputerCase
      )
    }
    if (coolerList.length > 0 && searchParams.get('cooler')) {
      changeSelectItem(searchParams.get('cooler') || '', ProductEnum.Cooler)
    }
  }, [
    cpuList,
    gpuList,
    motherboardList,
    ramList,
    ssdList,
    psuList,
    caseList,
    coolerList,
  ])

  useEffect(() => {
    // dispatch(sliceActions.clearSelectedItem())
  }, [dispatch])

  const changeSelectItem = (value: string, type: ProductEnum, _extraNum?: number) => {
    switch (type) {
      case ProductEnum.CPU: {
        const selectedItem = value ? searchCPUItem(cpuList, value) : null
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
      case ProductEnum.Cooler: {
        const selectedItem = searchAIOItem(coolerList, value)
        dispatch(sliceActions.updateSelectedCooler(selectedItem))
        break
      }
      default:
        break
    }
  }

  return (
    <NotificationsProvider>
      <Grid container spacing={1}>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.cpu?.id || ''}
            label={ProductEnum.CPU}
            options={generateCPUSelectElement(cpuList, selectedItems)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.gpu?.id || ''}
            label={ProductEnum.GPU}
            options={generateGPUSelectElement(gpuList)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.motherboard?.id || ''}
            label={ProductEnum.Motherboard}
            options={generateMotherboardSelectElement(
              motherboardList,
              selectedItems
            )}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.ram?.id || ''}
            label={ProductEnum.RAM}
            options={generateRAMSelectElement(ramList)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.ssd?.id || ''}
            label={ProductEnum.SSD}
            extraNum={0}
            options={generateSSDSelectElement(ssdList)}
            selectChange={changeSelectItem}
          />
          {/*
          <Button size="small" variant="text">
            {t('add-extra-ssd')}
          </Button>
          */}
        </Grid>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.psu?.id || ''}
            label={ProductEnum.PSU}
            options={generatePSUSelectElement(psuList)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.pcCase?.id || ''}
            label={ProductEnum.ComputerCase}
            options={generateCaseSelectElement(caseList)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            value={selectedItems.cooler?.id || ''}
            label={ProductEnum.Cooler}
            options={generateCoolerSelectElement(coolerList)}
            selectChange={changeSelectItem}
          />
        </Grid>
      </Grid>
    </NotificationsProvider>
  )
}
export default ComponentMenu
