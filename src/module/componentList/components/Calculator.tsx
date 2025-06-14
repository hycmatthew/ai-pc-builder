import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import styled from '@emotion/styled'
import { Grid } from '@mui/material'

import { SelectedItemType } from '../../../store/rawDataReducer'
import CusTypography from '../../common/components/CusTypography'
import { getTotalPriceStr } from '../../../utils/NumberHelper'

type CalculatorProps = {
  selectedItems: SelectedItemType
}

const CustomContainer = styled(Container)({
  backgroundColor: '#ffffff',
  padding: '0px !important',
  height: '100%',
})

const Calculator = ({ selectedItems }: CalculatorProps) => {
  const { t } = useTranslation()

  return (
    <CustomContainer>
      <Grid container spacing={0} height={'100%'} alignItems="center">
        <Grid size={12}>
          <CusTypography variant='h5'>
            {t('total-price')}
            {getTotalPriceStr(selectedItems)}
          </CusTypography>
        </Grid>
      </Grid>
    </CustomContainer>
  )
}

export default Calculator
