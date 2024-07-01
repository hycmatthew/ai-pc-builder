import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { useSelector } from 'react-redux'

import AppLayout from '../../common/AppLayout'
import ComponentMenu from '../components/ComponentMenu'
import Calculator from '../components/Calculator'
import PowerCalculator from '../components/PowerCalculator'
import CompatibleSection from '../components/CompatibleSection'
import ScoreSection from '../components/ScoreSection'

function MainPage() {
  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  return (
    <AppLayout>
      <Grid
        sx={{ flexGrow: 1 }}
        container
        spacing={6}
        columns={{ xs: 6, md: 12 }}
      >
        <Grid item xs={6}>
          <ComponentMenu dataState={dataState} />
        </Grid>
        <Grid item xs={6}>
          <PowerCalculator selectedItems={dataState.selectedItems} />
          <Calculator selectedItems={dataState.selectedItems} />
          <CompatibleSection selectedItems={dataState.selectedItems} />
          <ScoreSection selectedItems={dataState.selectedItems} />
        </Grid>
      </Grid>
    </AppLayout>
  )
}

export default MainPage
