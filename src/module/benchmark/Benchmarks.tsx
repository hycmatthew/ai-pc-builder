import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { Tabs, Tab } from '@mui/material'
import { Grid2 as Grid } from '@mui/material'
import ProductEnum from '../../constant/ProductEnum'

import CPUBenchmarksTable from './components/CPUBenchmarksTable'
import GPUBenchmarksTable from './components/GPUBenchmarksTable'
import RAMBenchmarksTable from './components/RAMBenchmarks'

const CustomTabs = styled(Tabs)({
  // 隐藏默认底部指示条
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  // 选项卡容器
  '& .MuiTabs-flexContainer': {
    gap: '4px',
    position: 'relative'
  }
})

const IosSegmentedTab = styled(Tab)({
  // 基础样式
  zIndex: 1,
  minHeight: '32px',
  minWidth: '120px',
  borderRadius: '6px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  color: '#3c3c43',
  border: 'none',

  // 未选中状态
  '&:not(.Mui-selected)': {
    '&:hover': {
      backgroundColor: '#f2f2f2'
    }
  },

  // 选中状态
  '&.Mui-selected': {
    color: '#000',
    backgroundColor: '#f2f2f2',
    '&:hover': {
      backgroundColor: '#fbfbfb'
    }
  },

  // 聚焦状态
  '&.Mui-focusVisible': {
    outline: `2px solid #333`,
    outlineOffset: '2px'
  }
});

function Benchmarks() {
  const { t } = useTranslation()
  const [itemType, setItemType] = React.useState(ProductEnum.CPU)

  const handleChange = (event: React.SyntheticEvent, newValue: ProductEnum) => {
    if (newValue !== null) {
      setItemType(newValue)
    }
  }

  return (
    <div className="bg-container">
      <div className="main-container">
        <Grid container spacing={0}>
          <Grid size={12}>
            <CustomTabs 
              value={itemType}
              onChange={handleChange}
              aria-label="basic tabs example"
              centered
            >
              <IosSegmentedTab label={t('cpu')} value={ProductEnum.CPU} />
              <IosSegmentedTab label={t('graphic-card')} value={ProductEnum.GPU} />
              <IosSegmentedTab label={t('ram')} value={ProductEnum.RAM} />
            </CustomTabs>
          </Grid>
          <Grid size={12}>
            {itemType === ProductEnum.CPU && <CPUBenchmarksTable />}
            {itemType === ProductEnum.GPU && <GPUBenchmarksTable />}
            {itemType === ProductEnum.RAM && <RAMBenchmarksTable />}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Benchmarks
