import {
  Card,
  CardActions,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded'
import PlaceholdImage from '../../common/components/PlaceholdImage'
import { AllType } from '../../../constant/objectTypes'
import { getLocalizedPriceNum } from '../../../utils/NumberHelper'

type ItemCardProps = {
  item: AllType
  disable: boolean
  addComparsion: () => void
  removeComparsion: () => void
}

const CustomCardHeader = styled(CardHeader)({
  padding: '14px 9px',
  textAlign: 'center',
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
  item,
  disable,
  addComparsion,
  removeComparsion,
}: ItemCardProps) => {
  return (
      <Card
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column',
          padding: '5px',
          height: '100%',
        }}
      >
        <CustomCardHeader titleTypographyProps={{ fontSize: '14px' }} title={item.name} />
        <PlaceholdImage
          data={item}
          height={150}
        />
        <CustomCardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <PriceTypography>{getLocalizedPriceNum(item)}</PriceTypography>
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
  )
}

export default ItemCard
