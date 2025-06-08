import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia
} from '@mui/material'

import { CPUType, MotherboardType } from '../../../constant/objectTypes'
import CusTypography from '../../common/components/CusTypography'

interface InfoTableProp {
  cpuType?: CPUType
  motherboardType?: MotherboardType
}

function ItemInfoTable({ cpuType, motherboardType }: InfoTableProp) {
  return (
    <Card>
      {cpuType && (
        <>
          <CardMedia
            component="img"
            height="140"
            image={cpuType.img}
            alt={cpuType.name}
          />
          <CardContent>
            <CusTypography variant="h5">
              {motherboardType?.name}
            </CusTypography>
            <CusTypography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </CusTypography>
          </CardContent>
          <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </>
      )}
    </Card>
  )
}

ItemInfoTable.defaultProps = {
  cpuType: null,
  motherboardType: null,
}

export default ItemInfoTable
