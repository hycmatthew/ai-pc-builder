import { Slider, Box, styled, Grid2 as Grid, Typography } from '@mui/material'
import { useState } from 'react'
import CustomTextField from './CustomTextField'
import CusTypography from './CusTypography'

const SliderBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: SliderBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      '@media (hover: none)': {
        boxShadow: SliderBoxShadow,
      },
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-track': {
    height: 4,
  },
  '& .MuiSlider-rail': {
    height: 4,
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
}))

interface RangeSliderProps {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number[]
  onChange?: (value: number[]) => void // 新增 onChange prop
}

export const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = [min, max],
  onChange,
}: RangeSliderProps) => {
  const [value, setValue] = useState<number[]>(defaultValue)

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const newValues = newValue as number[]
    setValue(newValues)
    onChange?.(newValues) // 触发外部回调
  }

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [...value]
      let num = Number(e.target.value)

      // 边界校验
      num = isNaN(num) ? value[index] : Math.min(Math.max(num, min), max)

      // 保持最小值不超过最大值
      if (index === 0) num = Math.min(num, value[1])
      if (index === 1) num = Math.max(num, value[0])

      newValue[index] = num
      setValue(newValue)
      onChange?.(newValue) // 触发外部回调
    }

  return (
    <Box sx={{ width: '100%' }}>
      {/* 标签行 */}
      <CusTypography variant="h6">价格范围</CusTypography>

      {/* 控制项容器 */}
      <Grid container spacing={2} alignItems="center" paddingTop={1}>
        {/* 手机端输入框（下方） */}
        <Grid size={12} sx={{ display: { xs: 'block', md: 'none' } }}>
          <Grid size={12}>
            <CustomSlider
              value={value}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={min}
              max={max}
              step={step}
              disableSwap
            />
          </Grid>
          <Grid
            size={12}
            sx={{
              display: 'flex',
              gap: 2,
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <CustomTextField
              type="number"
              value={value[0]}
              onChange={handleInputChange(0)}
              fullWidth
            />
            <CustomTextField
              type="number"
              value={value[1]}
              onChange={handleInputChange(1)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* 桌面端输入框（右侧） */}
        <Grid size={12} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <CustomTextField
              type="number"
              value={value[0]}
              onChange={handleInputChange(0)}
              width={150}
            />
            <Grid size={12}>
              <CustomSlider
                value={value}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                step={step}
                disableSwap
              />
            </Grid>
            <CustomTextField
              type="number"
              value={value[1]}
              onChange={handleInputChange(1)}
              width={150}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
