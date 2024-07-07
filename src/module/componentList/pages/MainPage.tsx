import { useSelector } from 'react-redux'
import { Unstable_Grid2 as Grid } from '@mui/material'

import ComponentMenu from '../components/ComponentMenu'
import Calculator from '../components/Calculator'
import PowerCalculator from '../components/PowerCalculator'
import CompatibleSection from '../components/CompatibleSection'
import ScoreSection from '../components/ScoreSection'
import HighLight from '../components/HighLight/HighLight'

import './MainPage.scss'

function MainPage() {
  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  return (
    <>
      <div className="bg-container blue-bg">
        <div className="main-container">
          <div className="main-overlay-card">
            <Grid
              sx={{ flexGrow: 1 }}
              container
              spacing={0}
              columns={{ xs: 6, md: 12 }}
            >
              <Grid xs={6}>
                <ComponentMenu dataState={dataState} />
              </Grid>
              <Grid xs={6}>
                <PowerCalculator selectedItems={dataState.selectedItems} />
                <Calculator selectedItems={dataState.selectedItems} />
                <CompatibleSection selectedItems={dataState.selectedItems} />
                <ScoreSection selectedItems={dataState.selectedItems} />
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
                <Grid xs={12}>
                  <HighLight />
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MainPage
