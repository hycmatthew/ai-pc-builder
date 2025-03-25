import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Grid2 as Grid,
  Box,
} from '@mui/material'
import CusTypography from '../../common/components/CusTypography'
import {
  componentConfig,
  ComponentType,
  DisplayType,
} from '../constant/componentConfig'

interface ResultCardProps {
  type: ComponentType
  price: string
  data?: any
  displayType?: DisplayType
  onClick?: () => void
}

const ResultCard: React.FC<ResultCardProps> = ({
  type,
  price,
  data,
  displayType = 'simple',
  onClick,
}) => {
  const config = componentConfig[type]

  if (!data) return null

  return (
    <Card sx={{ mb: 2, borderRadius: 2, width: '100%' }} onClick={onClick}>
      <CardHeader
        title={config.title}
        subheader={data.Name}
        sx={{
          '& .MuiCardHeader-title': { fontSize: '1.25rem', fontWeight: 600 },
          '& .MuiCardHeader-subheader': { fontSize: '0.75rem' },
        }}
      />
      <Box
        component="img"
        sx={{
          width: '100%',
          height: 200,
          objectFit: 'cover',
          backgroundColor: 'grey.100',
        }}
        alt={data.Name}
        src={
          data.Img ||
          `https://placehold.co/600x400?text=${data.Brand}+${data.Name}`
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          {config.properties[displayType].map((prop: any) => (
            <Grid size={6} key={prop.key}>
              <CusTypography variant="h6" color="text.secondary">
                {prop.label}
              </CusTypography>
              <CusTypography variant="caption">
                {data[prop.key] || '-'}
              </CusTypography>
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <CusTypography variant="h6" color="primary">
            {price}
          </CusTypography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ResultCard
