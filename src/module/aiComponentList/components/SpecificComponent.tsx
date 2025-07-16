import { Grid, Box, IconButton } from '@mui/material'
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
import LockOutlineIcon from '@mui/icons-material/LockOutline'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

type SpecificComponentProps = {
  rawData: DataState
  aiLogic: BuildLogicState
  changeSelectItem: (value: string, type: ProductEnum, num?: number) => void
  unlockItem: (type: ProductEnum) => void
}

// 動畫配置
const containerVariants = {
  unlocked: { width: '100%' },
  locked: { width: 'calc(100% - 32px)' },
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
  onUnlock,
}: {
  label: string
  options: any[]
  value: string
  lockStatus: boolean
  onChange: (value: string, type: ProductEnum, num?: number) => void
  onUnlock: () => void
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
      <AnimatedLockIcon visible={lockStatus} onUnlock={onUnlock} />
    </Box>
  </Grid>
)

const AnimatedLockIcon = ({
  visible,
  onUnlock,
}: {
  visible: boolean
  onUnlock: () => void
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="lock-button"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={lockIconVariants}
          style={{
            zIndex: 1,
            paddingLeft: 16,
          }}
        >
          <IconButton
            onClick={onUnlock}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            sx={{
              padding: '8px',
              color: 'primary.main',
              backgroundColor: hovered
                ? 'rgba(25, 118, 210, 0.08)'
                : 'transparent', // 悬停背景色变化
              transition: 'background-color 0.3s ease', // 背景色过渡效果
              borderRadius: '50%', // 圆形背景
              cursor: 'pointer', // 指针样式
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.12)', // 悬停时更深的背景色
              },
            }}
          >
            <motion.div
              key={hovered ? 'unlock' : 'lock'}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}
            >
              {hovered ? (
                <LockOpenIcon sx={{ fontSize: '1.5rem' }} />
              ) : (
                <LockOutlineIcon sx={{ fontSize: '1.5rem' }} />
              )}
            </motion.div>
          </IconButton>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SpecificComponent({
  rawData,
  aiLogic,
  changeSelectItem,
  unlockItem,
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
      type: ProductEnum.CPU,
      label: ProductEnum.CPU,
      options: generateCPUSelectElement(cpuList, preSelectedItem),
      value: preSelectedItem.cpu?.id || '',
      lockStatus: lockItem.cpu !== null,
    },
    {
      type: ProductEnum.GPU,
      label: ProductEnum.GPU,
      options: generateGPUSelectElement(gpuList),
      value: preSelectedItem.gpu?.id || '',
      lockStatus: lockItem.gpu !== null,
    },
    {
      type: ProductEnum.Motherboard,
      label: ProductEnum.Motherboard,
      options: generateMotherboardSelectElement(
        motherboardList,
        preSelectedItem
      ),
      value: preSelectedItem.motherboard?.id || '',
      lockStatus: lockItem.motherboard !== null,
    },
    {
      type: ProductEnum.RAM,
      label: ProductEnum.RAM,
      options: generateRAMSelectElement(ramList),
      value: preSelectedItem.ram?.id || '',
      lockStatus: lockItem.ram !== null,
    },
    {
      type: ProductEnum.SSD,
      label: ProductEnum.SSD,
      options: generateSSDSelectElement(ssdList),
      value: preSelectedItem.ssd?.id || '',
      lockStatus: lockItem.ssd !== null,
    },
    {
      type: ProductEnum.PSU,
      label: ProductEnum.PSU,
      options: generatePSUSelectElement(psuList),
      value: preSelectedItem.psu?.id || '',
      lockStatus: lockItem.psu !== null,
    },
    {
      type: ProductEnum.ComputerCase,
      label: ProductEnum.ComputerCase,
      options: generateCaseSelectElement(caseList),
      value: preSelectedItem.pcCase?.id || '',
      lockStatus: lockItem.pcCase !== null,
    },
    {
      type: ProductEnum.Cooler,
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
          onUnlock={() => unlockItem(config.type)} // 这里可以替换为实际的解锁逻辑
        />
      ))}
    </Grid>
  )
}

export default SpecificComponent
