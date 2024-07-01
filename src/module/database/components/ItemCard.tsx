import React from 'react'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import { EMPTY_IMG_DATA } from '../../../constant/EmptyImage'
import { priceLabelHandler } from '../../../utils/LabelHelper'

type ItemCardProps = {
  itemLabel: string
  priceLabel: string
  imgSrc: string
  disable: boolean
  addComparsion: () => void
  removeComparsion: () => void
}

const CustomCardHeader = styled(CardHeader)({
  padding: '14px 9px',
  textAlign: 'center'
})

const CustomCardActions = styled(CardActions)({
  padding: '3px',
})

const AddButton = styled(IconButton)({
  marginLeft: 'auto',
})

const PriceTypography = styled(Typography)({
  textAlign: 'left',
  fontSize: '12px',
  paddingLeft: 8,
})

const ItemCard = ({
  itemLabel,
  priceLabel,
  imgSrc,
  disable,
  addComparsion,
  removeComparsion,
}: ItemCardProps) => {
  return (
    <Grid key={itemLabel} item xs={3} style={{ display: 'flex' }}>
      <Card
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          padding: '5px'
        }}
      >
        <CustomCardHeader titleTypographyProps={{ fontSize: '14px' }} title={itemLabel} />
        <CardMedia
          component="img"
          image={imgSrc || EMPTY_IMG_DATA}
          alt={itemLabel}
        />
        <CustomCardActions>
          <PriceTypography>{priceLabelHandler(priceLabel)}</PriceTypography>
          {disable ? (
            <Tooltip title="Remove from Comparison">
              <AddButton color="warning" onClick={removeComparsion}>
                <RemoveRoundedIcon />
              </AddButton>
            </Tooltip>
          ) : (
            <Tooltip title="Add to Compare">
              <AddButton color="primary" onClick={addComparsion}>
                <AddRoundedIcon />
              </AddButton>
            </Tooltip>
          )}
        </CustomCardActions>
      </Card>
    </Grid>
  )
}

export default ItemCard
