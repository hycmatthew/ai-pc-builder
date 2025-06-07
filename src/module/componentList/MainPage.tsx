import { useSelector } from 'react-redux'
import { Box, Container, Grid2 as Grid, styled } from '@mui/material'

import ComponentMenu from './components/ComponentMenu'
import PowerCalculator from './components/PowerCalculator'
import CompatibleSection from './components/CompatibleSection'
import ScoreSection from './components/ScoreSection'

import './MainPage.scss'
import BuySection from './components/BuySection'
import { t } from 'i18next'
import { Link } from 'react-router-dom'

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
})

function MainPage() {
  const dataState = useSelector((state: any) => {
    return state.rawData
  })

  return (
    <Box className="bg-container blue-bg">
      <Box component="div">
        <Box
          component="img"
          sx={{
            width: '100%',
            height: '320px',
            objectFit: 'cover',
            backgroundPosition: 'center center',
          }}
          alt="The house from the offer."
          src="src/assets/image/pc-background-1.jpg"
        />
      </Box>
      <Box paddingY={2}>
        <Box className="main-container">
          <Box className="main-overlay-card">
            <Grid size={12} container spacing={0} columns={{ xs: 6, md: 12 }}>
              <Grid size={6}>
                <ComponentMenu dataState={dataState} />
              </Grid>
              <Grid size={6}>
                <CustomContainer>
                  <Grid container spacing={2} marginBottom={2}>
                    {t('try-ai-build-header')}
                    <Grid size="auto">
                      <Link to={`/${dataState.language}/ai-build`}>
                        {t('try-ai-build-button')} ➜
                      </Link>
                    </Grid>
                  </Grid>
                </CustomContainer>
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
