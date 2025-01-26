import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'
import { Box, Grid2 as Grid } from '@mui/material'

import { SelectedItemType } from '../../../store/rawDataReducer'
import { getTotalPriceStr } from '../../../utils/PCPartUtil'

type CalculatorProps = {
  selectedItems: SelectedItemType
}

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '8px',
})

const Calculator = ({ selectedItems }: CalculatorProps) => {
  const { t, i18n } = useTranslation()

  return (
    <CustomContainer>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Box sx={{ fontWeight: '600' }}>
            <Typography className="normal-header-typography">
              {t('price')}
            </Typography>
          </Box>
          <Typography>{getTotalPriceStr(selectedItems)}</Typography>
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default Calculator
