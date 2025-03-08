import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2 as Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'

import SpecificComponent from './components/SpecificComponent'
import { useAppDispatch } from './../../store/store'
import { buildType } from './constant/buildType'
import { preFilterDataLogic } from './logic/selectPartsLogic'
import ProductEnum from '../../constant/ProductEnum'
import {
  searchCPUItem,
  searchMotherboardItem,
  searchGPUItem,
  searchRAMItem,
  searchSSDItem,
  searchPSUItem,
  searchCaseItem,
  searchAIOItem,
} from '../common/utils/searchItemLogic'
import { sliceActions } from './store/aiLogicReducer'

function AILogicPage() {
  const dataState = useSelector((state: any) => {
    return state
  })

  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    type: '',
    budget: '',
    size: 'ATX',
  })

  const updateType = (event: any) => {
    setFormData((prevData) => ({
      ...prevData,
      type: event.target.value,
    }))
  }

  const budgetTextfieldChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const maxLength = 7
    const budget = event.target.value.replace(/^0+/, '')
    if (budget.length < maxLength) {
      setFormData((prevData) => ({
        ...prevData,
        budget: budget,
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        budget: budget.slice(0, maxLength),
      }))
    }
  }

  const disableButtonLogic = () => {
    if (formData.type == '') {
      return true
    }
    if (Number(formData.budget) <= 0) {
      return true
    }
    return false
  }

  const generateListLogic = () => {
    const res = preFilterDataLogic(
      dataState.rawData.cpuList,
      dataState.rawData.motherboardList,
      dataState.rawData.gpuList,
      dataState.rawData.ramList,
      dataState.rawData.ssdList,
      dataState.rawData.caseList,
      dataState.rawData.psuList,
      dataState.rawData.coolerList,
      Number(formData.budget),
      formData.type
    )
    if (res.cpu) {
      changeSelectItem(res.cpu.name, ProductEnum.CPU)
    }
    if (res.gpu) {
      changeSelectItem(res.gpu.name, ProductEnum.GPU)
    }
    if (res.motherboard) {
      changeSelectItem(res.motherboard.name, ProductEnum.Motherboard)
    }
    if (res.ram) {
      changeSelectItem(res.ram.name, ProductEnum.RAM)
    }
    if (res.ssd) {
      changeSelectItem(res.ssd.name, ProductEnum.SSD)
    }
    if (res.psu) {
      changeSelectItem(res.psu.name, ProductEnum.PSU)
    }
    if (res.case) {
      changeSelectItem(res.case.name, ProductEnum.ComputerCase)
    }
    if (res.cooler) {
      changeSelectItem(res.cooler.name, ProductEnum.Cooler)
    }
  }

  const changeSelectItem = (value: string, type: string, num?: number) => {
    console.log('changeSelectItem', value, " - ", type)
    switch (type) {
      case ProductEnum.CPU: {
        const selectedItem = value ? searchCPUItem(dataState.rawData.cpuList, value) : null
        dispatch(sliceActions.updatePreSelectedCPU(selectedItem))
        break
      }
      case ProductEnum.Motherboard: {
        const selectedItem = value ? searchMotherboardItem(dataState.rawData.motherboardList, value) : null
        dispatch(sliceActions.updatePreSelectedMotherboard(selectedItem))
        break
      }
      case ProductEnum.GPU: {
        const selectedItem = value ? searchGPUItem(dataState.rawData.gpuList, value) : null
        dispatch(sliceActions.updatePreSelectedGPU(selectedItem))
        break
      }
      case ProductEnum.RAM: {
        const selectedItem = value ? searchRAMItem(dataState.rawData.ramList, value) : null
        dispatch(sliceActions.updatePreSelectedRAM(selectedItem))
        break
      }
      case ProductEnum.SSD: {
        const selectedItem = value ? searchSSDItem(dataState.rawData.ssdList, value) : null
        dispatch(sliceActions.updatePreSelectedSSD(selectedItem))
        break
      }
      case ProductEnum.PSU: {
        const selectedItem = value ? searchPSUItem(dataState.rawData.psuList, value) : null
        console.log('selectedItem psu', selectedItem)
        dispatch(sliceActions.updatePreSelectedPSU(selectedItem))
        break
      }
      case ProductEnum.ComputerCase: {
        const selectedItem = value ? searchCaseItem(dataState.rawData.caseList, value) : null
        console.log('selectedItem case', selectedItem)
        dispatch(sliceActions.updatePreSelectedCase(selectedItem))
        break
      }
      case ProductEnum.Cooler: {
        const selectedItem = value ? searchAIOItem(dataState.rawData.coolerList, value) : null
        console.log('selectedItem cooler', selectedItem)
        dispatch(sliceActions.updatePreSelectedCooler(selectedItem))
        break
      }
      default:
        break
    }
  }

  return (
    <div className="main-container">
      <div className="main-overlay-card">
        <Grid size={12} container spacing={0} columns={{ xs: 6, md: 12 }}>
          <Grid size={12}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Gender
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={formData.type}
                onChange={updateType}
              >
                {buildType.map((item) => (
                  <FormControlLabel
                    value={item.value}
                    control={<Radio />}
                    label={item.key}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <Box
              component="form"
              sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Budget"
                variant="filled"
                type="number"
                size="small"
                value={formData.budget}
                onChange={budgetTextfieldChanged}
              />
              <Button
                variant="contained"
                disabled={disableButtonLogic()}
                onClick={generateListLogic}
              >
                Contained
              </Button>
            </Box>
          </Grid>
          <Grid size={6}>
            <SpecificComponent rawData={dataState.rawData} aiLogic={dataState.aiLogic} changeSelectItem={changeSelectItem} />
          </Grid>
          <Grid size={6}></Grid>
        </Grid>
      </div>
    </div>
  )
}

export default AILogicPage
