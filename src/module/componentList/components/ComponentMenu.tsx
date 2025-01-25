import { useEffect, useState } from 'react'
import { Button, Grid2 as Grid } from '@mui/material'
import { NotificationsProvider } from '@toolpad/core/useNotifications'

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
import { useTranslation } from 'react-i18next'
import { getTotalPrice } from '../../../utils/PCPartUtil'
import ListCopyModal from '../../common/components/ListCopyModal'

type ComponentMenuProps = {
  dataState: DataState
}

const ComponentMenu = ({ dataState }: ComponentMenuProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

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
  } = dataState

  const changeSelectItem = (value: string, type: string, extraNum?: number) => {
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
        /*
        const selectedItem = searchSSDItem(ssdList, value)
        let selectedSSD = [...[], ...selectedItems.ssd]
        if (!isNil(extraNum) && selectedItem) {
          console.log(selectedItem)
          selectedSSD[extraNum] = selectedItem
          console.log(selectedSSD)
          dispatch(sliceActions.updateSelectedSSD(selectedSSD))
        }
        */
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

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  return (
    <NotificationsProvider>
      <Grid container spacing={1}>
        <Grid size={12}>
          <SelectElement
            label={ProductEnum.CPU}
            options={generateCPUSelectElement(cpuList, selectedItems)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            label={ProductEnum.GPU}
            options={generateGPUSelectElement(gpuList, selectedItems)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
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
            label={ProductEnum.RAM}
            options={generateRAMSelectElement(ramList, selectedItems)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            label={ProductEnum.SSD}
            extraNum={0}
            options={generateSSDSelectElement(ssdList, selectedItems)}
            selectChange={changeSelectItem}
          />
          <Button size="small" variant="text">
            {t('add-extra-ssd')}
          </Button>
        </Grid>
        <Grid size={12}>
          <SelectElement
            label={ProductEnum.PSU}
            options={generatePSUSelectElement(psuList, selectedItems)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            label={ProductEnum.ComputerCase}
            options={generateCaseSelectElement(caseList, selectedItems)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <SelectElement
            label={ProductEnum.AIO}
            options={generateAIOSelectElement(aioList, selectedItems)}
            selectChange={changeSelectItem}
          />
        </Grid>
        <Grid size={12}>
          <Button
            disabled={getTotalPrice(dataState.selectedItems) == 0}
            onClick={handleOpen}
            variant="contained"
          >
            Contained
          </Button>
          <ListCopyModal
            selectedItems={dataState.selectedItems}
            open={open}
            handleClose={handleClose}
          />
        </Grid>
      </Grid>
    </NotificationsProvider>
  )
}
export default ComponentMenu
