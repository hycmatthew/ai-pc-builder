import React from 'react'
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from '@mui/material'
import ProductEnum from '../../../constant/ProductEnum'
import SelectElement from '../../common/components/SelectElement'
import {
  generateCPUSelectElement,
  generateGPUSelectElement,
  generateMotherboardSelectElement,
  generateRAMSelectElement,
  generateSSDSelectElement,
  generatePSUSelectElement,
  generateCaseSelectElement,
  generateAIOSelectElement,
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
import { useAppDispatch } from '../../../store/store'
import { sliceActions } from '../store/aiLogicReducer'

type SpecificComponentProps = {
  rawData: any
  currectStep: number
  updateStep: (newStep: number) => void
}

function SpecificComponent({
  rawData,
  currectStep,
  updateStep,
}: SpecificComponentProps) {
  const submitButtonOnClick = () => {
    if (currectStep === 2) {
      updateStep(3)
    }
  }

  const dispatch = useAppDispatch()
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
  } = rawData

  const changeSelectItem = (value: string, type: string) => {
    console.log(type);
    console.log(value);
    switch (type) {
      case ProductEnum.CPU: {
        const selectedItem = searchCPUItem(cpuList, value)
        dispatch(sliceActions.updatePreSelectedCPU(selectedItem))
        break
      }
      case ProductEnum.Motherboard: {
        const selectedItem = searchMotherboardItem(motherboardList, value)
        dispatch(sliceActions.updatePreSelectedMotherboard(selectedItem))
        break
      }
      case ProductEnum.GPU: {
        const selectedItem = searchGPUItem(gpuList, value)
        dispatch(sliceActions.updatePreSelectedGPU(selectedItem))
        break
      }
      case ProductEnum.RAM: {
        const selectedItem = searchRAMItem(ramList, value)
        dispatch(sliceActions.updatePreSelectedRAM(selectedItem))
        break
      }
      case ProductEnum.SSD: {
        const selectedItem = searchSSDItem(ssdList, value)
        dispatch(sliceActions.updatePreSelectedSSD(selectedItem))
        break
      }
      case ProductEnum.PSU: {
        const selectedItem = searchPSUItem(psuList, value)
        dispatch(sliceActions.updatePreSelectedPSU(selectedItem))
        break
      }
      case ProductEnum.ComputerCase: {
        const selectedItem = searchCaseItem(caseList, value)
        dispatch(sliceActions.updatePreSelectedCase(selectedItem))
        break
      }
      case ProductEnum.AIO: {
        const selectedItem = searchAIOItem(aioList, value)
        dispatch(sliceActions.updatePreSelectedAIO(selectedItem))
        break
      }
      case ProductEnum.AirCooler: {
        const selectedItem = searchAirCoolerItem(airCoolerList, value)
        dispatch(sliceActions.updatePreSelectedAirCooler(selectedItem))
        break
      }
      default:
        break
    }
  }

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.CPU}
              options={generateCPUSelectElement(cpuList, selectedItems)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.GPU}
              options={generateGPUSelectElement(gpuList)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.Motherboard}
              options={generateMotherboardSelectElement(
                motherboardList,
                selectedItems
              )}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.RAM}
              options={generateRAMSelectElement(ramList, selectedItems)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.SSD}
              options={generateSSDSelectElement(ssdList)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.PSU}
              options={generatePSUSelectElement(psuList, selectedItems)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.ComputerCase}
              options={generateCaseSelectElement(caseList, selectedItems)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.AIO}
              options={generateAIOSelectElement(aioList)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid item xs={9}>
            <SelectElement
              label={ProductEnum.AirCooler}
              options={generateAirCoolerSelectElement(
                airCoolerList,
                selectedItems
              )}
              selectChange={changeSelectItem}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={submitButtonOnClick}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default SpecificComponent
