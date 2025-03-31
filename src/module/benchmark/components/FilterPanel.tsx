import { Box, TextField, Paper } from '@mui/material'
import { RangeSlider } from '../../common/components/RangeSlider'

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
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* 名称过滤 */}
        <TextField
          label="搜索名称"
          variant="outlined"
          value={nameFilter}
          onChange={(e) => onNameFilterChange(e.target.value)}
          sx={{
            flex: 1,
            width: '100%',
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
            },
          }}
        />

        {/* 价格过滤 */}
        <Box sx={{ flex: 2, minWidth: 300, width: '100%' }}>
          <RangeSlider
            min={minPrice}
            max={maxPrice}
            defaultValue={priceRange}
            onChange={onPriceRangeChange}
          />
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              justifyContent: 'space-between',
              color: '#666',
              fontSize: 14,
            }}
          >
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
