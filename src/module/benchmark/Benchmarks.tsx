import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid2 as Grid } from '@mui/material'
import ProductEnum from '../../constant/ProductEnum'

import CPUBenchmarksTable from './components/CPUBenchmarksTable'
import GPUBenchmarksTable from './components/GPUBenchmarksTable'
import RAMBenchmarksTable from './components/RAMBenchmarks'
import SegmentedTabs from '../common/components/SegmentedTabs'

function Benchmarks() {
  const { t } = useTranslation()
  const [selectedType, setSelectedType] = useState<ProductEnum>(ProductEnum.CPU)

  const tabs = [
    { label: t('cpu'), value: ProductEnum.CPU },
    { label: t('graphic-card'), value: ProductEnum.GPU },
    { label: t('ram'), value: ProductEnum.RAM }
  ]
  
  const handleChange = (_event: React.SyntheticEvent, newValue: any) => {
    if (newValue !== null) {
      setSelectedType(newValue as ProductEnum)
    }
  }

  return (
    <div className="bg-container">
      <div className="main-container">
        <Grid container spacing={0}>
          <Grid>
          <SegmentedTabs
            value={selectedType}
            onChange={handleChange}
            tabs={tabs}
            centered
          />
          </Grid>
          <Grid size={12}>
            {selectedType === ProductEnum.CPU && <CPUBenchmarksTable />}
            {selectedType === ProductEnum.GPU && <GPUBenchmarksTable />}
            {selectedType === ProductEnum.RAM && <RAMBenchmarksTable />}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Benchmarks
