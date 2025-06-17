import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CircularProgress,
  FormLabel,
  Grid,
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

const AnimatedGrid = styled(Grid)(() => ({
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
  const aiLogicData = useSelector((state: any) => state.aiLogic)
  const rawData = useSelector((state: any) => state.rawData)
  const preSelectedItem = useSelector(
    (state: any) => state.aiLogic.preSelectedItem
  )

  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  // 优化2: 使用useMemo缓存静态数据
  const tabs = useMemo(
    () => [
      { label: t(BuildType.Balance), value: BuildType.Balance },
      { label: t(BuildType.Gaming), value: BuildType.Gaming },
      { label: t(BuildType.Rendering), value: BuildType.Rendering },
      { label: t(BuildType.AI), value: BuildType.AI },
    ],
    [t]
  )

  const storageTabs = useMemo(
    () => [
      { label: '500GB', value: 500 },
      { label: '1TB', value: 1000 },
      { label: '2TB', value: 2000 },
      { label: '4TB', value: 4000 },
    ],
    []
  )

  const [selectedType, setSelectedType] = useState<BuildType | null>(null)
  const [selectedStorage, setSelectedStorage] = useState(1000)
  const [activeStep, setActiveStep] = useState(0)
  const [displaySysError, setDisplaySysError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    budget: '',
    size: 'ATX',
  })

  // 优化4: 使用useMemo缓存resData
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

  const updateType = (_event: React.SyntheticEvent, newValue: any) => {
    if (newValue !== null) {
      setSelectedType(newValue as BuildType)
      // 选择usage后自动允许进入下一步
      if (activeStep === 0) {
        setActiveStep(1)
      }
    }
  }

  const updateSelectedStorage = (
    _event: React.SyntheticEvent,
    newValue: any
  ) => {
    setSelectedStorage(newValue)
  }

  useEffect(() => {
    setResData(preSelectedItem)
  }, [preSelectedItem])

  const handleNext = () => {
    setLoading(true)
    setDisplaySysError(false)
    setActiveStep(2)
    setTimeout(() => {
      // 使用setTimeout確保UI有時間更新
      generateListLogic()
    }, 0)
  }

  const clearDataLogic = () => {
    console.log('clearDataLogic')
    setDisplaySysError(false)
    setActiveStep(1)
    dispatch(sliceActions.clearPreSelectedData())
    setFormData({ ...formData, budget: '' })
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
    return Number(formData.budget) <= 0
  }

  const generateListLogic = () => {
    const logicItems = aiLogicData.lockItem
    // 获取组件列表
    const getComponentList = (
      componentType: keyof typeof logicItems,
      fallbackList: any[]
    ) =>
      logicItems[componentType] ? [logicItems[componentType]] : fallbackList

    const res = preFilterDataLogic(
      getComponentList('cpu', rawData.cpuList),
      getComponentList('motherboard', rawData.motherboardList),
      getComponentList('gpu', rawData.gpuList),
      getComponentList('ram', rawData.ramList),
      getComponentList('ssd', rawData.ssdList),
      getComponentList('case', rawData.caseList),
      getComponentList('psu', rawData.psuList),
      getComponentList('cooler', rawData.coolerList),
      Number(formData.budget),
      selectedStorage,
      selectedType as BuildType
    )

    console.log('generateListLogic', res)
    setLoading(false)
    if (res !== null) {
      if (res.cpu) {
        changeSelectItem(res.cpu.id, ProductEnum.CPU, -1)
      }
      if (res.gpu) {
        changeSelectItem(res.gpu.id, ProductEnum.GPU, -1)
      } else {
        changeSelectItem('', ProductEnum.GPU, -1)
      }
      if (res.motherboard) {
        changeSelectItem(res.motherboard.id, ProductEnum.Motherboard, -1)
      }
      if (res.ram) {
        changeSelectItem(res.ram.id, ProductEnum.RAM, -1)
      }
      if (res.ssd) {
        changeSelectItem(res.ssd.id, ProductEnum.SSD, -1)
      }
      if (res.psu) {
        changeSelectItem(res.psu.id, ProductEnum.PSU, -1)
      }
      if (res.case) {
        changeSelectItem(res.case.id, ProductEnum.ComputerCase, -1)
      }
      if (res.cooler) {
        changeSelectItem(res.cooler.id, ProductEnum.Cooler, -1)
      }
      dispatch(sliceActions.updateScoreAndPrirce(res))
    } else {
      console.log('setDisplaySysError')
      setDisplaySysError(true)
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

    const productList = rawData[handler.listPath]
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
                  value={selectedType ?? null}
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
                      loading={loading}
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
                {/* 在零件選擇區域添加加載遮罩 */}
                {loading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      zIndex: 10,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <CircularProgress size={60} />
                  </div>
                )}
                <AnimatedGrid size={6} paddingTop={2}>
                  <SpecificComponent
                    rawData={rawData}
                    aiLogic={aiLogicData}
                    changeSelectItem={changeSelectItem}
                  />
                </AnimatedGrid>
                <AnimatedGrid size={6}>
                  <CompatibleSection
                    selectedItems={aiLogicData.preSelectedItem}
                    systemError={displaySysError ? 'system-error' : undefined}
                  />
                </AnimatedGrid>
              </>
            )}

            {/* Step 3 - Results */}
            {activeStep === 2 && (
              <AnimatedGrid size={12}>
                <ResultComponent
                  resultData={resData}
                  totalPrice={aiLogicData.totalPrice}
                  totalScore={aiLogicData.totalScore}
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
