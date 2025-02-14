import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid2 as Grid,
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
}

function SpecificComponent({
  rawData,
}: SpecificComponentProps) {

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
  } = rawData

  const changeSelectItem = (value: string, type: string, num?: number) => {
    switch (type) {
      case ProductEnum.CPU: {
        const selectedItem = value ? searchCPUItem(cpuList, value) : null
        dispatch(sliceActions.updatePreSelectedCPU(selectedItem))
        break
      }
      case ProductEnum.Motherboard: {
        const selectedItem = value ? searchMotherboardItem(motherboardList, value) : null
        dispatch(sliceActions.updatePreSelectedMotherboard(selectedItem))
        break
      }
      case ProductEnum.GPU: {
        const selectedItem = value ? searchGPUItem(gpuList, value) : null
        dispatch(sliceActions.updatePreSelectedGPU(selectedItem))
        break
      }
      case ProductEnum.RAM: {
        const selectedItem = value ? searchRAMItem(ramList, value) : null
        dispatch(sliceActions.updatePreSelectedRAM(selectedItem))
        break
      }
      case ProductEnum.SSD: {
        const selectedItem = value ? searchSSDItem(ssdList, value) : null
        dispatch(sliceActions.updatePreSelectedSSD(selectedItem))
        break
      }
      case ProductEnum.PSU: {
        const selectedItem = value ? searchPSUItem(psuList, value) : null
        dispatch(sliceActions.updatePreSelectedPSU(selectedItem))
        break
      }
      case ProductEnum.ComputerCase: {
        const selectedItem = value ? searchCaseItem(caseList, value) : null
        dispatch(sliceActions.updatePreSelectedCase(selectedItem))
        break
      }
      case ProductEnum.AIO: {
        const selectedItem = value ? searchAIOItem(aioList, value) : null
        dispatch(sliceActions.updatePreSelectedAIO(selectedItem))
        break
      }
      case ProductEnum.AirCooler: {
        const selectedItem = value ? searchAirCoolerItem(airCoolerList, value) : null
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
              options={generateGPUSelectElement(gpuList)}
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
              options={generateSSDSelectElement(ssdList)}
              selectChange={changeSelectItem}
            />
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
              options={generateAIOSelectElement(aioList)}
              selectChange={changeSelectItem}
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>{}}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default SpecificComponent
