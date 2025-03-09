import {
  Card,
  CardContent,
  CardActions,
  Button,
  Grid2 as Grid,
  Box,
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
  onChange
}: {
  label: string;
  options: any[];
  value: string;
  lockStatus: boolean;
  onChange: (value: string, type: ProductEnum, num?: number) => void
}) => (
  <Grid size={12}>
    <Box
      component={motion.div}
      sx={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
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
);

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
);

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
      value: preSelectedItem.cpu?.Name || '',
    },
    {
      type: 'gpu',
      label: ProductEnum.GPU,
      options: generateGPUSelectElement(gpuList, preSelectedItem),
      value: preSelectedItem.gpu?.Name || '',
    },
    {
      type: 'motherboard',
      label: ProductEnum.Motherboard,
      options: generateMotherboardSelectElement(motherboardList, preSelectedItem),
      value: preSelectedItem.motherboard?.Name || '',
    },
    {
      type: 'ram',
      label: ProductEnum.RAM,
      options: generateRAMSelectElement(ramList, preSelectedItem),
      value: preSelectedItem.ram?.Name || '',
    },
    {
      type: 'ssd',
      label: ProductEnum.SSD,
      options: generateSSDSelectElement(ssdList, preSelectedItem),
      value: preSelectedItem.ssd?.Name || '',
    },
    {
      type: 'psu',
      label: ProductEnum.PSU,
      options: generatePSUSelectElement(psuList, preSelectedItem),
      value: preSelectedItem.psu?.Name || '',
    },
    {
      type: 'case',
      label: ProductEnum.ComputerCase,
      options: generateCaseSelectElement(caseList, preSelectedItem),
      value: preSelectedItem.pcCase?.Name || '',
    },
    {
      type: 'cooler',
      label: ProductEnum.Cooler,
      options: generateAIOSelectElement(coolerList, preSelectedItem),
      value: preSelectedItem.cooler?.Name || '',
    },
  ];
  
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container spacing={1}>
          {productConfigs.map(config => (
            <ProductSelectGrid
              key={config.type}
              // productType={config.type as keyof typeof ProductEnum}
              label={config.label}
              options={config.options}
              value={config.value}
              lockStatus={lockItem[config.type as keyof typeof lockItem]}
              onChange={changeSelectItem}
            />
          ))}
        </Grid>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => {}}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default SpecificComponent
