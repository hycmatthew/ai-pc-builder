import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import { Unstable_Grid2 as Grid } from '@mui/material'
import ProductEnum from '../../../constant/ProductEnum'

import CPUBenchmarksTable from '../components/CPUBenchmarksTable'
import GPUBenchmarksTable from '../components/GPUBenchmarksTable'
import RAMBenchmarksTable from '../components/RAMBenchmarks'

const CustomToggleButton = styled(ToggleButton)({
  background: '#fff',
  width: 120,
})

function Benchmarks() {
  const { t } = useTranslation()
  const [itemType, setItemType] = React.useState(ProductEnum.CPU)

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: ProductEnum
  ) => {
    if (newType !== null) {
      setItemType(newType)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        <ToggleButtonGroup
          color="primary"
          value={itemType}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <CustomToggleButton sx={{ width: 100 }} value={ProductEnum.CPU}>
            {t('cpu')}
          </CustomToggleButton>
          <CustomToggleButton sx={{ width: 100 }} value={ProductEnum.GPU}>
            {t('graphic-card')}
          </CustomToggleButton>
          <CustomToggleButton sx={{ width: 100 }} value={ProductEnum.RAM}>
            {t('ram')}
          </CustomToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid xs={12}>
        {itemType === ProductEnum.CPU && <CPUBenchmarksTable />}
        {itemType === ProductEnum.GPU && <GPUBenchmarksTable />}
        {itemType === ProductEnum.RAM && <RAMBenchmarksTable />}
      </Grid>
    </Grid>
  )
}

export default Benchmarks
