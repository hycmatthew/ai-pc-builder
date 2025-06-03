import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Box,
  Divider,
} from '@mui/material'
import CusTypography from '../../common/components/CusTypography'
import { componentConfig, ComponentType } from '../constant/componentConfig'
import { useTranslation } from 'react-i18next'
import { addCurrencySign, getAllPriceByRegion } from '../../../utils/NumberHelper'
import PlatformIcon from '../../common/components/PlatformIcon'
import BuyButton from '../../common/components/BuyButton'
import PlaceholdImage from '../../common/components/PlaceholdImage'

interface ResultCardProps {
  type: ComponentType
  price: string
  data?: any
  onClick?: () => void
}

const ResultCard: React.FC<ResultCardProps> = ({
  type,
  price,
  data,
  onClick,
}) => {
  const { t } = useTranslation()
  const config = componentConfig[type]

  if (!data) return null

  const currentPrices = getAllPriceByRegion(data.prices)

  return (
    <Card sx={{ mb: 2, borderRadius: 2, width: '100%' }} onClick={onClick}>
      <CardHeader
        title={t(config.title)}
        subheader={`${t(data.brand)} ${data.name}`}
        sx={{
          '& .MuiCardHeader-title': { fontSize: '1.25rem', fontWeight: 600 },
          '& .MuiCardHeader-subheader': { fontSize: '0.75rem' },
        }}
      />
      <PlaceholdImage data={data} height={180} />
      <CardContent>
        <Grid container spacing={2}>
          {config.properties.simple.map((prop: any) => (
            <Grid size={6} key={prop.key}>
              <CusTypography variant="h6" color="text.secondary">
                {t(prop.label)}
              </CusTypography>
              <CusTypography variant="caption">
                {prop.formatter ? prop.formatter(data) : data[prop.key] || '-'}
              </CusTypography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
      <Divider />
      <Grid container spacing={1} padding={1}>
        {currentPrices.map((price, index) => (
          <Grid size={12} key={`${data.Name}-price-${index}`}>
            <Grid container spacing={1}>
              <Grid size="auto">
                <PlatformIcon platform={price.platform} />
              </Grid>
              <Grid size="auto">
                <CusTypography variant="h6" lineHeight={2}>
                  {t(price.platform)}
                </CusTypography>
              </Grid>
              <Grid size="auto">
                <CusTypography variant="h6" lineHeight={2}>
                  {addCurrencySign(price.price)}
                </CusTypography>
              </Grid>
              <Grid size="grow" paddingRight={1}>
                <BuyButton
                  href={currentPrices[0].price_link}
                  variant="contained"
                  color="primary"
                >
                  {t('buyNow')}
                </BuyButton>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Card>
  )
}

export default ResultCard
