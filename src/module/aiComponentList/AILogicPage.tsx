import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  FormLabel,
  Grid2 as Grid,
  Stack,
  Step,
  StepLabel,
  Stepper,
  styled,
} from '@mui/material'

import SpecificComponent from './components/SpecificComponent'
import { useAppDispatch } from './../../store/store'
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
import CompatibleSection from '../componentList/components/CompatibleSection'
import { useTranslation } from 'react-i18next'
import SegmentedTabs from '../common/components/SegmentedTabs'
import CustomTextField from '../common/components/CustomTextField'
import CustomButton from '../common/components/CustomButton'
import { BuildType } from './constant/buildType'

type ProductHandlers = {
  [key in ProductEnum]: {
    searchFn: (list: any[], value: string) => any
    listPath: string
    updateAction: (payload: any) => any
    lockAction: (payload: any) => any
  }
}

const steps = ['Select Usage', 'Configure Parts', 'Build Result']

const AnimatedGrid = styled(Grid)(({ theme }) => ({
  animation: 'fadeInSlideUp 0.5s ease-out',
  overflow: 'hidden',
  '@keyframes fadeInSlideUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(20px)',
      maxHeight: 0,
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
      maxHeight: '1000px', // 根据实际最大高度调整
    },
  },
}))

function AILogicPage() {
  const dataState = useSelector((state: any) => {
    return state
  })

  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [selectedType, setSelectedType] = useState<BuildType>(BuildType.Balance)
  const [selectedStorage, setSelectedStorage] = useState(1000)

  const tabs = [
    { label: t(BuildType.Balance), value: BuildType.Balance },
    { label: t(BuildType.Gaming), value: BuildType.Gaming },
    { label: t(BuildType.Rendering), value: BuildType.Rendering },
    { label: t(BuildType.AI), value: BuildType.AI },
  ]

  const storageTabs = [
    { label: '500GB', value: 500 },
    { label: '1TB', value: 1000 },
    { label: '2TB', value: 2000 },
    { label: '4TB', value: 4000 },
  ]

  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    generateListLogic()
    setActiveStep(2)
  }

  const updateType = (event: React.SyntheticEvent, newValue: any) => {
    if (newValue !== null) {
      setSelectedType(newValue as BuildType)
      // 选择usage后自动允许进入下一步
      if (activeStep === 0) {
        setActiveStep(1)
      }
    }
  }

  const updateSelectedStorage = (
    event: React.SyntheticEvent,
    newValue: any
  ) => {
    setSelectedStorage(newValue)
  }

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
    return Number(formData.budget) <= 0
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
      selectedStorage,
      selectedType
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
      dispatch(sliceActions.updateScoreAndPrirce(res))
    }
  }

  const clearDataLogic = () => {
    // Define the clearPreSelectedData function here
    console.log('clearDataLogic')
    setActiveStep(1)
    dispatch(sliceActions.clearPreSelectedData())
    setFormData({ ...formData, budget: '' })
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
    <div className="bg-container blue-bg">
      <div className="main-container">
        <div className="main-overlay-card">
          <Grid container spacing={0} columns={{ xs: 6, md: 12 }}>
            <Grid size={12}>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{t(label)}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            {/* Step 1 - Usage Selection */}
            <AnimatedGrid size={12}>
              <FormLabel>{t('Usage')}</FormLabel>
              <Stack padding={1}>
                <SegmentedTabs
                  value={selectedType}
                  onChange={updateType}
                  tabs={tabs}
                />
              </Stack>
            </AnimatedGrid>
            {/* Step 2 - Budget & Parts Selection */}
            {activeStep > 0 && (
              <>
                <AnimatedGrid size={12}>
                  <FormLabel>{t('Storage')}</FormLabel>
                  <Stack padding={1}>
                    <SegmentedTabs
                      value={selectedStorage}
                      onChange={updateSelectedStorage}
                      tabs={storageTabs}
                    />
                  </Stack>
                </AnimatedGrid>
                <AnimatedGrid size={12}>
                  <FormLabel>{t('Budget')}</FormLabel>
                </AnimatedGrid>
                <AnimatedGrid size={12}>
                  <Stack spacing={2} padding={1} direction="row">
                    <CustomTextField
                      type="number"
                      value={formData.budget}
                      onChange={budgetTextfieldChanged}
                      width={200}
                    />
                    <CustomButton
                      variant="contained"
                      onClick={handleNext}
                      disabled={disableButtonLogic()}
                      sx={{ height: '40px' }}
                    >
                      {t('confirm')}
                    </CustomButton>
                    <CustomButton
                      variant="outlined"
                      onClick={clearDataLogic}
                      sx={{ height: '40px' }}
                    >
                      {t('clear')}
                    </CustomButton>
                  </Stack>
                </AnimatedGrid>
                <AnimatedGrid size={6} paddingTop={2}>
                  <SpecificComponent
                    rawData={dataState.rawData}
                    aiLogic={dataState.aiLogic}
                    changeSelectItem={changeSelectItem}
                  />
                </AnimatedGrid>
                <AnimatedGrid size={6}>
                  <CompatibleSection
                    selectedItems={dataState.aiLogic.preSelectedItem}
                  />
                </AnimatedGrid>
              </>
            )}

            {/* Step 3 - Results */}
            {activeStep === 2 && (
              <AnimatedGrid size={12}>
                <ResultComponent
                  resultData={resData}
                  totalPrice={dataState.aiLogic.totalPrice}
                  totalScore={dataState.aiLogic.totalScore}
                />
              </AnimatedGrid>
            )}
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default AILogicPage
