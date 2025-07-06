import { Grid, Box } from '@mui/material'
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
import LockIcon from '@mui/icons-material/Lock'
import { AnimatePresence, motion } from 'framer-motion'

type SpecificComponentProps = {
  rawData: DataState
  aiLogic: BuildLogicState
  changeSelectItem: (value: string, type: ProductEnum, num?: number) => void
}

// 動畫配置
const containerVariants = {
  unlocked: { width: '100%' },
  locked: { width: 'calc(100% - 48px)' },
}

const lockIconVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
}

const ProductSelectGrid = ({
  label,
  options,
  value,
  lockStatus,
  onChange,
}: {
  label: string
  options: any[]
  value: string
  lockStatus: boolean
  onChange: (value: string, type: ProductEnum, num?: number) => void
}) => (
  <Grid size={12}>
    <Box
      component={motion.div}
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
      layout
      animate={lockStatus ? 'locked' : 'unlocked'}
      variants={containerVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <SelectElement
        label={label}
        value={value}
        options={options}
        selectChange={onChange}
        sx={{
          width: '100%',
          transition: 'none',
        }}
      />
      <AnimatedLockIcon visible={lockStatus} />
    </Box>
  </Grid>
)

const AnimatedLockIcon = ({ visible }: { visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        key="lock-icon"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={lockIconVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <LockIcon
          sx={{
            margin: 'auto',
            paddingLeft: '12px',
            position: 'absolute',
            color: 'primary.main',
            fontSize: '1.2rem',
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
)

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

  const { preSelectedItem, lockItem } = aiLogic

  const productConfigs = [
    {
      type: 'cpu',
      label: ProductEnum.CPU,
      options: generateCPUSelectElement(cpuList, preSelectedItem),
      value: preSelectedItem.cpu?.id || '',
      lockStatus: lockItem.cpu !== null,
    },
    {
      type: 'gpu',
      label: ProductEnum.GPU,
      options: generateGPUSelectElement(gpuList),
      value: preSelectedItem.gpu?.id || '',
      lockStatus: lockItem.gpu !== null,
    },
    {
      type: 'motherboard',
      label: ProductEnum.Motherboard,
      options: generateMotherboardSelectElement(
        motherboardList,
        preSelectedItem
      ),
      value: preSelectedItem.motherboard?.id || '',
      lockStatus: lockItem.motherboard !== null,
    },
    {
      type: 'ram',
      label: ProductEnum.RAM,
      options: generateRAMSelectElement(ramList),
      value: preSelectedItem.ram?.id || '',
      lockStatus: lockItem.ram !== null,
    },
    {
      type: 'ssd',
      label: ProductEnum.SSD,
      options: generateSSDSelectElement(ssdList),
      value: preSelectedItem.ssd?.id || '',
      lockStatus: lockItem.ssd !== null,
    },
    {
      type: 'psu',
      label: ProductEnum.PSU,
      options: generatePSUSelectElement(psuList),
      value: preSelectedItem.psu?.id || '',
      lockStatus: lockItem.psu !== null,
    },
    {
      type: 'case',
      label: ProductEnum.ComputerCase,
      options: generateCaseSelectElement(caseList),
      value: preSelectedItem.pcCase?.id || '',
      lockStatus: lockItem.pcCase !== null,
    },
    {
      type: 'cooler',
      label: ProductEnum.Cooler,
      options: generateAIOSelectElement(coolerList),
      value: preSelectedItem.cooler?.id || '',
      lockStatus: lockItem.cooler !== null,
    },
  ]

  return (
    <Grid container spacing={1}>
      {productConfigs.map((config) => (
        <ProductSelectGrid
          key={config.type}
          label={config.label}
          options={config.options}
          value={config.value}
          lockStatus={config.lockStatus}
          onChange={changeSelectItem}
        />
      ))}
    </Grid>
  )
}

export default SpecificComponent
