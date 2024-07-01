import React from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'

import { SelectedItemType } from '../../store/rawDataReducer'
import {
  cpuPerformanceLogic,
  gpuPerformanceLogic,
  ramPerformanceLogic,
  ssdPerformanceLogic,
} from '../../../logic/performanceLogic'

type ScoreSectionProps = {
  selectedItems: SelectedItemType
}

const HeaderTypography = styled(Typography)({
  fontSize: '9px',
})

const ScoreTypography = styled(Typography)({
  fontSize: '24px',
})

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
  borderRadius: '6px',
  marginTop: '16px',
})

const ScoreSection = ({ selectedItems }: ScoreSectionProps) => {
  const { t, i18n } = useTranslation()

  const totalScore = () => {
    const result = cpuPerformanceLogic(selectedItems.cpu)
      + gpuPerformanceLogic(selectedItems.gpu)
      + ramPerformanceLogic(selectedItems.ram)
      + ssdPerformanceLogic(selectedItems.ssd)
    return result
  }

  return (
    <CustomContainer>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <HeaderTypography className="normal-header-typography">
            {t('cpu-score')}
          </HeaderTypography>
          <ScoreTypography>
            {cpuPerformanceLogic(selectedItems.cpu)}
          </ScoreTypography>
        </Grid>
        <Grid item xs={8}>
          <HeaderTypography className="normal-header-typography">
            {t('gpu-score')}
          </HeaderTypography>
          <ScoreTypography>
            {gpuPerformanceLogic(selectedItems.gpu)}
          </ScoreTypography>
        </Grid>
        <Grid item xs={8}>
          <HeaderTypography className="normal-header-typography">
            {t('ram-score')}
          </HeaderTypography>
          <ScoreTypography>
            {ramPerformanceLogic(selectedItems.ram)}
          </ScoreTypography>
        </Grid>
        <Grid item xs={8}>
          <HeaderTypography className="normal-header-typography">
            {t('ssd-score')}
          </HeaderTypography>
          <ScoreTypography>
            {ssdPerformanceLogic(selectedItems.ssd)}
          </ScoreTypography>
        </Grid>
        <Grid item xs={8}>
          <HeaderTypography className="normal-header-typography">
            {t('total-score')}
          </HeaderTypography>
          <ScoreTypography>
            {totalScore()}
          </ScoreTypography>
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default ScoreSection
