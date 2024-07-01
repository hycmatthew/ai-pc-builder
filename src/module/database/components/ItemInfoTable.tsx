import React, { useEffect } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'

import { CPUType, MotherboardType } from '../../../constant/objectTypes'

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
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over
              6,000 species, ranging across all continents except Antarctica
            </Typography>
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
