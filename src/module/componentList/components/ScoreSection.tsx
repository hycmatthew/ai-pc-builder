import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'
import { Box, Button, Grid2 as Grid } from '@mui/material'

import { SelectedItemType } from '../../../store/rawDataReducer'
import {
  cpuPerformanceLogic,
  gpuPerformanceLogic,
  ramPerformanceLogic,
  ssdPerformanceLogic,
} from '../../../logic/performanceLogic'
import CusTypography from '../../common/components/CusTypography'
import CustomTooltip from '../../common/components/CustomTooltip'

type ScoreSectionProps = {
  selectedItems: SelectedItemType
}
const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
  borderRadius: '6px',
})

const ScoreSection = ({ selectedItems }: ScoreSectionProps) => {
  const { t } = useTranslation()

  const totalScore = () => {
    const result =
      cpuPerformanceLogic(selectedItems.cpu) +
      gpuPerformanceLogic(selectedItems.gpu) +
      ramPerformanceLogic(selectedItems.ram) +
      ssdPerformanceLogic(selectedItems.ssd)
    return result
  }

  return (
    <CustomContainer>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Box display="flex">
            <CusTypography variant="h6">{t('cpu-score')}</CusTypography>
            <CustomTooltip title="4132132" />
          </Box>
          <CusTypography variant="h4">
            {cpuPerformanceLogic(selectedItems.cpu)}
          </CusTypography>
        </Grid>
        <Grid size={6}>
          <Box display="flex">
            <CusTypography variant="h6">{t('gpu-score')}</CusTypography>
            <CustomTooltip title="4132132" />
          </Box>
          <CusTypography variant="h4">
            {gpuPerformanceLogic(selectedItems.gpu)}
          </CusTypography>
        </Grid>
        <Grid size={6}>
          <CusTypography variant="h6">{t('ram-score')}</CusTypography>
          <CusTypography variant="h4">
            {ramPerformanceLogic(selectedItems.ram)}
          </CusTypography>
        </Grid>
        <Grid size={6}>
          <CusTypography variant="h6">{t('ssd-score')}</CusTypography>
          <CusTypography variant="h4">
            {ssdPerformanceLogic(selectedItems.ssd)}
          </CusTypography>
        </Grid>
        <Grid size={8}>
          <CusTypography variant="h6">{t('total-score')}</CusTypography>
          <CusTypography variant="h4">{totalScore()}</CusTypography>
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default ScoreSection
