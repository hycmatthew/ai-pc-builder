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
  '.MuiButtonBase-root': {
    outline: 'none',
  },
})

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
            >
              <Tab label={t('cpu')} value={ProductEnum.CPU} />
              <Tab label={t('graphic-card')} value={ProductEnum.GPU} />
              <Tab label={t('ram')} value={ProductEnum.RAM} />
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
