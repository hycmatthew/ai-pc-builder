import { useSelector } from 'react-redux'
import { Alert, Grid2 as Grid } from '@mui/material'

import ComponentMenu from './components/ComponentMenu'
import PowerCalculator from './components/PowerCalculator'
import CompatibleSection from './components/CompatibleSection'
import ScoreSection from './components/ScoreSection'
import HighLight from './components/HighLight/HighLight'

import './MainPage.scss'

function MainPage() {
  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  return (
    <div className="bg-container blue-bg">
      <div className="main-container">
        <div className="main-overlay-card">
          <Grid size={12} container spacing={0} columns={{ xs: 6, md: 12 }}>
            <Grid size={6}>
              <ComponentMenu dataState={dataState} />
            </Grid>
            <Grid size={6}>
              <ScoreSection selectedItems={dataState.selectedItems} />
              <PowerCalculator selectedItems={dataState.selectedItems} />
              <CompatibleSection selectedItems={dataState.selectedItems} />
            </Grid>
          </Grid>
        </div>
      </div>
      <div className="bg-container">
        <div className="main-container">
          <div className="highlight-container">
            <Grid
              sx={{ flexGrow: 1 }}
              container
              spacing={0}
              columns={{ xs: 6, md: 12 }}
            >
              <Grid size={12}>
                <HighLight />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage
