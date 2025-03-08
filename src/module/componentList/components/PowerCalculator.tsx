import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'
import { Box, Grid2 as Grid } from '@mui/material'

import { SelectedItemType } from '../../../store/rawDataReducer'
import { getTotalPower } from '../../../utils/NumberHelper'
import recommendPowerLogic from '../../../logic/recommendPower'
import CusTypography from '../../common/components/CusTypography'

type CalculatorProps = {
  selectedItems: SelectedItemType
}

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
})

const Calculator = ({ selectedItems }: CalculatorProps) => {
  const { t } = useTranslation()
  const totalPower = getTotalPower(selectedItems)

  const recommendPower = () => {
    return totalPower === 0 ? 0 : recommendPowerLogic(totalPower)
  }

  return (
    <CustomContainer>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Box sx={{ fontWeight: '600' }}>
            <CusTypography variant="h6">{t('power-calculator')}</CusTypography>
          </Box>
          <CusTypography variant="body1">
            {totalPower}
            <span>{t('watt')}</span>
          </CusTypography>
        </Grid>
        <Grid size={6}>
          <Box sx={{ fontWeight: '600' }}>
            <CusTypography variant="h6">
              {t('recommended-psu-wattage')}
            </CusTypography>
          </Box>
          <CusTypography variant="body1">
            {recommendPower()}
            <span>{t('watt')}</span>
          </CusTypography>
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default Calculator
