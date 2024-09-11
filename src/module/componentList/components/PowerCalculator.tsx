import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'
import { Box, Unstable_Grid2 as Grid } from '@mui/material'

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
        <Grid xs={8}>
          <Typography className="normal-header-typography">
            <Box sx={{ fontWeight: '600' }}>{t('power-calculator')}</Box>
          </Typography>
          <Typography>
            {totalPower}
            <span>{t('watt')}</span>
          </Typography>
        </Grid>
        <Grid xs={8}>
          <Typography className="normal-header-typography">
            <Box sx={{ fontWeight: '600' }}>{t('recommended-psu-wattage')}</Box>
          </Typography>
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
