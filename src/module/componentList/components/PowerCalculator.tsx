import React from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'

import { SelectedItemType } from '../../store/rawDataReducer'
import { getTotalPower } from '../../../utils/NumberHelper'
import recommendPowerLogic from '../../../logic/recommendPower'

type CalculatorProps = {
  selectedItems: SelectedItemType
}

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
  borderRadius: '6px',
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
        <Grid item xs={8}>
          <Typography className="normal-header-typography">{t('power-calculator')}</Typography>
          <Typography>
            {totalPower}
            <span>{t('watt')}</span>
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography className="normal-header-typography">{t('recommended-psu-wattage')}</Typography>
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
