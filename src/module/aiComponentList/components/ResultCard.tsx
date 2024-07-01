import React from 'react'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { EMPTY_IMG_DATA } from '../../../constant/EmptyImage'
import { addCurrencySign } from '../../../utils/NumberHelper'

type ResultCardProps = {
  nameLabel: string
  priceLabel: string
  imgSrc: string
}

const CustomCardHeader = styled(CardHeader)({
  padding: '14px 9px',
  textAlign: 'center'
})

const CustomCardActions = styled(CardActions)({
  padding: '3px',
})

const PriceTypography = styled(Typography)({
  textAlign: 'left',
  fontSize: '12px',
  paddingLeft: 8,
})

const ResultCard = ({
  nameLabel,
  priceLabel,
  imgSrc
}: ResultCardProps) => {
  return (
    <Grid key={nameLabel} item xs={3} style={{ display: 'flex' }}>
      <Card
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          padding: '5px'
        }}
      >
        <CustomCardHeader titleTypographyProps={{ fontSize: '14px' }} title={nameLabel} />
        <CardMedia
          component="img"
          image={imgSrc || EMPTY_IMG_DATA}
          alt={nameLabel}
        />
        <CustomCardActions>
          <PriceTypography>{priceLabel === '0.00' ? '-' : addCurrencySign(priceLabel)}</PriceTypography>
        </CustomCardActions>
      </Card>
    </Grid>
  )
}

export default ResultCard
