import { useSelector } from 'react-redux'
import { Box, Grid } from '@mui/material'

import ComponentMenu from './components/ComponentMenu'
import PowerCalculator from './components/PowerCalculator'
import CompatibleSection from './components/CompatibleSection'
import ScoreSection from './components/ScoreSection'

import './MainPage.scss'
import BuySection from './components/BuySection'
import { t } from 'i18next'
import HeroBanner from '../common/components/HeroBanner'

function MainPage() {
  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  return (
    <Box className="bg-container blue-bg">
      <HeroBanner
        imageUrl={`${import.meta.env.BASE_URL}image/pc-background-1.jpg`}
        imageHeight={320}
        titleText={<>{t('try-ai-build-header')}</>}
        buttonText={t('try-ai-build-button')}
        buttonLink="ai-build"
        imageAlt="DIY PC Background"
        contentSx={{
          backgroundColor: 'rgba(10, 9, 9, 0.3)',
          backdropFilter: 'blur(2px)',
        }}
        titleSx={{
          fontSize: { xs: '1.5rem', md: '2rem' },
          fontWeight: 700,
        }}
      />
      <Box paddingY={2}>
        <Box className="main-container">
          <Box className="main-overlay-card">
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
            <Box>
              <BuySection dataState={dataState} />
            </Box>
          </Box>
        </Box>
      </Box>
      {/*
      <Box className="bg-container">
        <Box className="main-container">
          <Box className="highlight-container">
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
          </Box>
        </Box>
      </Box>
    */}
    </Box>
  )
}

export default MainPage
