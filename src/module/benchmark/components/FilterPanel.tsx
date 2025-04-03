import { Box, Grid2 as Grid, Paper } from '@mui/material'
import { RangeSlider } from '../../common/components/RangeSlider'
import CustomTextField from '../../common/components/CustomTextField'

export type PriceRange = [number, number]

interface FilterPanelProps {
  nameFilter: string
  priceRange: PriceRange
  minPrice?: number
  maxPrice?: number
  onNameFilterChange: (value: string) => void
  onPriceRangeChange: (range: number[]) => void
}

export const FilterPanel = ({
  nameFilter,
  priceRange,
  minPrice = 0,
  maxPrice = 2000,
  onNameFilterChange,
  onPriceRangeChange,
}: FilterPanelProps) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* 名称过滤 */}
        <Grid size={3}>
          <CustomTextField
            label="搜索名称"
            value={nameFilter}
            onChange={(e) => onNameFilterChange(e.target.value)}
          />
        </Grid>

        {/* 价格过滤 */}
        <Grid size={6}>
          <Box sx={{ flex: 2, minWidth: 300, width: '100%' }}>
            <RangeSlider
              min={minPrice}
              max={maxPrice}
              defaultValue={priceRange}
              onChange={onPriceRangeChange}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
