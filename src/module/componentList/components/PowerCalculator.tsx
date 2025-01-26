import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'
import { Box, Grid2 as Grid } from '@mui/material'

import { SelectedItemType } from '../../../store/rawDataReducer'
import { getTotalPower } from '../../../utils/NumberHelper'
import recommendPowerLogic from '../../../logic/recommendPower'

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
            <Typography className="normal-header-typography">
              {t('power-calculator')}
            </Typography>
          </Box>
          <Typography>
            {totalPower}
            <span>{t('watt')}</span>
          </Typography>
        </Grid>
        <Grid size={6}>
          <Box sx={{ fontWeight: '600' }}>
            <Typography className="normal-header-typography">
              {t('recommended-psu-wattage')}
            </Typography>
          </Box>
          <Typography>
            {recommendPower()}
            <span>{t('watt')}</span>
          </Typography>
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default Calculator
