import { useEffect, useState } from 'react'
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
import ResultComponent from './components/ResultComponent'

type ProductHandlers = {
  [key in ProductEnum]: {
    searchFn: (list: any[], value: string) => any
    listPath: string
    updateAction: (payload: any) => any
    lockAction: (payload: any) => any
  }
}

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
  const [resData, setResData] = useState({
    cpu: null,
    motherboard: null,
    gpu: null,
    ram: null,
    psu: null,
    pcCase: null,
    ssd: null,
    cooler: null,
  })

  useEffect(() => {
    setResData(dataState.aiLogic.preSelectedItem)
  }, [dataState.aiLogic.preSelectedItem])

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
    const logicItems = dataState.aiLogic.lockItem

    const cpus = logicItems.cpu ? [logicItems.cpu] : dataState.rawData.cpuList
    const gpus = logicItems.gpu ? [logicItems.gpu] : dataState.rawData.gpuList
    const motherboards = logicItems.motherboard
      ? [logicItems.motherboard]
      : dataState.rawData.motherboardList
    const rams = logicItems.ram ? [logicItems.ram] : dataState.rawData.ramList
    const ssds = logicItems.ssd ? [logicItems.ssd] : dataState.rawData.ssdList
    const cases = logicItems.pcCase
      ? [logicItems.pcCase]
      : dataState.rawData.caseList
    const psus = logicItems.psu ? [logicItems.psu] : dataState.rawData.psuList
    const coolers = logicItems.cooler
      ? [logicItems.cooler]
      : dataState.rawData.coolerList

    const res = preFilterDataLogic(
      cpus,
      motherboards,
      gpus,
      rams,
      ssds,
      cases,
      psus,
      coolers,
      Number(formData.budget),
      formData.type
    )
    if (res !== null) {
      if (res.cpu) {
        changeSelectItem(res.cpu.name, ProductEnum.CPU, -1)
      }
      if (res.gpu) {
        changeSelectItem(res.gpu.name, ProductEnum.GPU, -1)
      }
      if (res.motherboard) {
        changeSelectItem(res.motherboard.name, ProductEnum.Motherboard, -1)
      }
      if (res.ram) {
        changeSelectItem(res.ram.name, ProductEnum.RAM, -1)
      }
      if (res.ssd) {
        changeSelectItem(res.ssd.name, ProductEnum.SSD, -1)
      }
      if (res.psu) {
        changeSelectItem(res.psu.name, ProductEnum.PSU, -1)
      }
      if (res.case) {
        changeSelectItem(res.case.name, ProductEnum.ComputerCase, -1)
      }
      if (res.cooler) {
        changeSelectItem(res.cooler.name, ProductEnum.Cooler, -1)
      }
    } else {
    }
  }

  // 配置映射
  const PRODUCT_HANDLERS: ProductHandlers = {
    [ProductEnum.CPU]: {
      searchFn: searchCPUItem,
      listPath: 'cpuList',
      updateAction: sliceActions.updatePreSelectedCPU,
      lockAction: sliceActions.updateCPULock,
    },
    [ProductEnum.Motherboard]: {
      searchFn: searchMotherboardItem,
      listPath: 'motherboardList',
      updateAction: sliceActions.updatePreSelectedMotherboard,
      lockAction: sliceActions.updateMotherboardLock,
    },
    [ProductEnum.GPU]: {
      searchFn: searchGPUItem,
      listPath: 'gpuList',
      updateAction: sliceActions.updatePreSelectedGPU,
      lockAction: sliceActions.updateGPULock,
    },
    [ProductEnum.RAM]: {
      searchFn: searchRAMItem,
      listPath: 'ramList',
      updateAction: sliceActions.updatePreSelectedRAM,
      lockAction: sliceActions.updateRAMLock,
    },
    [ProductEnum.SSD]: {
      searchFn: searchSSDItem,
      listPath: 'ssdList',
      updateAction: sliceActions.updatePreSelectedSSD,
      lockAction: sliceActions.updateSSDLock,
    },
    [ProductEnum.PSU]: {
      searchFn: searchPSUItem,
      listPath: 'psuList',
      updateAction: sliceActions.updatePreSelectedPSU,
      lockAction: sliceActions.updatePSULock,
    },
    [ProductEnum.ComputerCase]: {
      searchFn: searchCaseItem,
      listPath: 'caseList',
      updateAction: sliceActions.updatePreSelectedCase,
      lockAction: sliceActions.updateCaseLock,
    },
    [ProductEnum.Cooler]: {
      searchFn: searchAIOItem,
      listPath: 'coolerList',
      updateAction: sliceActions.updatePreSelectedCooler,
      lockAction: sliceActions.updateCoolerLock,
    },
  }

  // 优化后的统一处理函数
  const changeSelectItem = (value: string, type: ProductEnum, num?: number) => {
    console.log('changeSelectItem', value, ' - ', type)

    const handler = PRODUCT_HANDLERS[type]
    if (!handler) {
      console.error(`Invalid product type: ${type}`)
      return
    }

    const productList = dataState.rawData[handler.listPath]
    const selectedItem = value ? handler.searchFn(productList, value) : null

    dispatch(handler.updateAction(selectedItem))

    if (selectedItem && num != -1) {
      dispatch(handler.lockAction(selectedItem))
    } else {
      dispatch(handler.lockAction(null))
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
            <SpecificComponent
              rawData={dataState.rawData}
              aiLogic={dataState.aiLogic}
              changeSelectItem={changeSelectItem}
            />
          </Grid>
          <Grid size={12}>
            <ResultComponent resultData={resData}></ResultComponent>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default AILogicPage
