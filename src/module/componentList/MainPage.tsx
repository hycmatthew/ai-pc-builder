import { useSelector } from 'react-redux'
import { Box, Container, Grid2 as Grid, styled } from '@mui/material'

import ComponentMenu from './components/ComponentMenu'
import PowerCalculator from './components/PowerCalculator'
import CompatibleSection from './components/CompatibleSection'
import ScoreSection from './components/ScoreSection'
import HighLight from './components/HighLight/HighLight'

import './MainPage.scss'
import BuySection from './components/BuySection'
import { t } from 'i18next'
import { getTotalPrice } from '../../utils/NumberHelper'
import CustomButton from '../common/components/CustomButton'
import Calculator from './components/Calculator'
import ListCopyDialog from './components/ListCopyDialog'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
})

function MainPage() {
  const dataState = useSelector((state: any) => {
    return state.rawData
  })
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  return (
    <Box className="bg-container">
      <Box className="blue-bg" paddingY={2}>
        <Box className="main-container">
          <Box className="main-overlay-card">
            <Grid size={12} container spacing={0} columns={{ xs: 6, md: 12 }}>
              <Grid size={6}>
                <ComponentMenu dataState={dataState} />
              </Grid>
              <Grid size={6}>
                <CustomContainer>
                  <Grid container spacing={2} marginBottom={2}>
                    <Grid size="auto">
                      <CustomButton
                        disabled={getTotalPrice(dataState.selectedItems) == 0}
                        onClick={handleOpen}
                        fullWidth
                      >
                        {t('open')}
                      </CustomButton>
                      <ListCopyDialog
                        selectedItems={dataState.selectedItems}
                        open={open}
                        onClose={handleClose}
                      />
                    </Grid>
                    <Grid size="auto">
                      <Link to={`/${dataState.language}/ai-build`}>
                        <CustomButton fullWidth>{t('ai-list')}</CustomButton>
                      </Link>
                    </Grid>
                  </Grid>
                </CustomContainer>
                <ScoreSection selectedItems={dataState.selectedItems} />
                <PowerCalculator selectedItems={dataState.selectedItems} />
                <CustomContainer>
                  <Grid container spacing={2} marginBottom={2}>
                    <Grid size={8}>
                      <Calculator selectedItems={dataState.selectedItems} />
                    </Grid>
                  </Grid>
                </CustomContainer>
                <CompatibleSection selectedItems={dataState.selectedItems} />
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className="main-container">
          <Box className="main-overlay-card">
            <BuySection dataState={dataState} />
          </Box>
        </Box>
      </Box>
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
    </Box>
  )
}

export default MainPage
