import { useEffect, useState } from 'react'
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Unstable_Grid2 as Grid,
  Modal,
  TextField,
} from '@mui/material'

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

type ComponentMenuProps = {
  dataState: DataState
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const ComponentMenu = ({ dataState }: ComponentMenuProps) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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

  const getSelectItemList = () => {
    const selectedItems = dataState.selectedItems

    return `
    ${t(ProductEnum.CPU)}: ${selectedItems.cpu?.Name} ${selectedItems.cpu?.PriceCN}\n
    ${t(ProductEnum.CPU)}: ${selectedItems.cpu?.Name} ${selectedItems.cpu?.PriceCN}\n
    ${t(ProductEnum.CPU)}: ${selectedItems.cpu?.Name} ${selectedItems.cpu?.PriceCN}\n
    ${t(ProductEnum.CPU)}: ${selectedItems.cpu?.Name} ${selectedItems.cpu?.PriceCN}\n
    `;
  }

  return (
    <Grid container spacing={1}>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.CPU}
          options={generateCPUSelectElement(cpuList, selectedItems)}
          selectChange={changeSelectItem}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.GPU}
          options={generateGPUSelectElement(gpuList, selectedItems)}
          selectChange={changeSelectItem}
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
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.RAM}
          options={generateRAMSelectElement(ramList, selectedItems)}
          selectChange={changeSelectItem}
        />
      </Grid>
      <Grid xs={12}>
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
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.PSU}
          options={generatePSUSelectElement(psuList, selectedItems)}
          selectChange={changeSelectItem}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.ComputerCase}
          options={generateCaseSelectElement(caseList, selectedItems)}
          selectChange={changeSelectItem}
        />
      </Grid>
      <Grid xs={12}>
        <SelectElement
          label={ProductEnum.AIO}
          options={generateAIOSelectElement(aioList, selectedItems)}
          selectChange={changeSelectItem}
        />
      </Grid>
      <Grid xs={12}>
        <Button onClick={handleOpen} variant="contained">
          Contained
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Box sx={{ maxWidth: '100%' }}>
                <TextField
                  id="outlined-multiline-static"
                  label="Multiline"
                  multiline
                  rows={10}
                  defaultValue={getSelectItemList()}
                  variant="filled"
                />
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Grid>
    </Grid>
  )
}
export default ComponentMenu
