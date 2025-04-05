import { Box, Grid2 as Grid, Paper } from '@mui/material'
import { RangeSlider } from '../../common/components/RangeSlider'
import CustomTextField from '../../common/components/CustomTextField'
import CustomAutocomplete from '../../common/components/CustomAutocomplete'

export type PriceRange = [number, number]

interface FilterPanelProps {
  brands: string[]
  brandFilter: string
  nameFilter: string
  priceRange: PriceRange
  minPrice?: number
  maxPrice?: number
  onBrandFilterChange: (value: string) => void
  onNameFilterChange: (value: string) => void
  onPriceRangeChange: (range: number[]) => void
}

export const FilterPanel = ({
  brands,
  brandFilter,
  nameFilter,
  priceRange,
  minPrice = 0,
  maxPrice = 2000,
  onBrandFilterChange,
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
          gap: 2,
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Brand 过滤 */}
        <Grid size={3}>
          <CustomAutocomplete
            value={brandFilter}
            options={brands}
            label="Brand"
            renderOption={(props, option) => (
              <li {...props} style={{ padding: '8px 16px' }}>
                {option}
              </li>
            )}
            onChange={(e, val) => onBrandFilterChange(val === null ? '' : val)}
          />
        </Grid>

        {/* 名称过滤 */}
        <Grid size={3}>
          <CustomTextField
            label="搜索名称"
            value={nameFilter}
            onChange={(e) => onNameFilterChange(e.target.value)}
          />
        </Grid>

        {/* 价格过滤 */}
        <Grid size={5}>
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
