import { Slider, Box, styled, Grid2 as Grid } from '@mui/material'
import { useState } from 'react'
import CustomTextField from './CustomTextField'
import CusTypography from './CusTypography'
import { useTranslation } from 'react-i18next'

type InputLayout =
  | 'responsive' // 默认响应式
  | 'below' // 强制输入框在下方
  | 'side' // 强制输入框在两侧
  | 'none' // 隐藏输入框

const SliderBoxShadow =
  '0 0px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 18,
    width: 18,
    backgroundColor: '#fff',
    boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
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
  inputLayout?: InputLayout
  onChange?: (value: number[]) => void // 新增 onChange prop
}

export const RangeSlider = ({
  label = 'price',
  min = 0,
  max = 100,
  step = 1,
  defaultValue = [min, max],
  inputLayout = 'responsive', // 默认响应式
  onChange,
}: RangeSliderProps) => {
  const { t } = useTranslation()
  const [value, setValue] = useState<number[]>(defaultValue)

  // 计算布局显示条件
  const showMobileLayout =
    inputLayout === 'below' ||
    (inputLayout === 'responsive' &&
      typeof window !== 'undefined' &&
      window.innerWidth < 900) // 与 md 断点保持一致

  const showDesktopLayout =
    inputLayout === 'side' ||
    (inputLayout === 'responsive' &&
      typeof window !== 'undefined' &&
      window.innerWidth >= 900)

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
    <Box sx={{ width: '100%', paddingY: 1 }}>
      {/* 标签行 */}
      <CusTypography variant="h6">{t(label)}</CusTypography>

      {/* 控制项容器 */}
      <Grid container spacing={2} alignItems="center" paddingTop={1}>
        {/* 手机端输入框（下方） */}
        {inputLayout !== 'none' && (
          <Grid
            size={12}
            sx={{
              display: showMobileLayout ? 'block' : 'none',
              // 强制覆盖响应式显示
              ...(inputLayout === 'below' && { display: 'block !important' }),
              ...(inputLayout === 'side' && { display: 'none !important' }),
            }}
          >
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
        )}
        {/* 桌面端输入框（右侧） */}
        {inputLayout !== 'none' && (
          <Grid
            size={12}
            sx={{
              display: showDesktopLayout ? 'block' : 'none',
              // 强制覆盖响应式显示
              ...(inputLayout === 'side' && { display: 'block !important' }),
              ...(inputLayout === 'below' && { display: 'none !important' }),
            }}
          >
            <Box sx={{ display: 'flex', gap: 4 }}>
              <CustomTextField
                type="number"
                value={value[0]}
                onChange={handleInputChange(0)}
                width={160}
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
                width={160}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
