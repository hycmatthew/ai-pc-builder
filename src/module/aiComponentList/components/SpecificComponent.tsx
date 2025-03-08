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
import { BuildLogicState } from '../store/aiLogicReducer'
import { DataState } from '../../../store/rawDataReducer'

type SpecificComponentProps = {
  rawData: DataState,
  aiLogic: BuildLogicState,
  changeSelectItem: (value: string, type: string, num?: number) => void
};

function SpecificComponent({
  rawData,
  aiLogic,
  changeSelectItem,
}: SpecificComponentProps) {

  const {
    cpuList,
    gpuList,
    motherboardList,
    ramList,
    ssdList,
    psuList,
    caseList,
    coolerList,
  } = rawData

  const {
    preSelectedItem
  } = aiLogic

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.CPU}
              value={preSelectedItem.cpu?.Name || ''}
              options={generateCPUSelectElement(cpuList, preSelectedItem)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.GPU}
              value={preSelectedItem.gpu?.Name || ''}
              options={generateGPUSelectElement(gpuList)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.Motherboard}
              value={preSelectedItem.motherboard?.Name || ''}
              options={generateMotherboardSelectElement(
                motherboardList,
                preSelectedItem
              )}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.RAM}
              value={preSelectedItem.ram?.Name || ''}
              options={generateRAMSelectElement(ramList, preSelectedItem)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.SSD}
              value={preSelectedItem.ssd?.Name || ''}
              options={generateSSDSelectElement(ssdList)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.PSU}
              value={preSelectedItem.psu?.Name || ''}
              options={generatePSUSelectElement(psuList, preSelectedItem)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.ComputerCase}
              value={preSelectedItem.pcCase?.Name || ''}
              options={generateCaseSelectElement(caseList, preSelectedItem)}
              selectChange={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <SelectElement
              label={ProductEnum.Cooler}
              value={preSelectedItem.cooler?.Name || ''}
              options={generateAIOSelectElement(coolerList)}
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
