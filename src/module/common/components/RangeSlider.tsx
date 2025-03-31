import { Slider, TextField, Box, styled } from '@mui/material'
import { useState } from 'react'

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 28,
    width: 28,
    backgroundColor: '#fff',
    boxShadow: iOSBoxShadow,
    '&:focus, &:hover, &.Mui-active': {
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
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

const Input = styled(TextField)({
  width: 80,
  '& input': {
    textAlign: 'center',
    padding: '8px 12px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '& fieldset': {
      borderColor: '#e0e0e0',
    },
    '&:hover fieldset': {
      borderColor: '#b3b3b3',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#007aff',
      borderWidth: 1,
    },
  },
})

interface RangeSliderProps {
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
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
      <Input
        value={value[0]}
        onChange={handleInputChange(0)}
        variant="outlined"
        slotProps={{
          htmlInput: { min, max },
        }}
      />

      <IOSSlider
        value={value}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        min={min}
        max={max}
        step={step}
        disableSwap
      />

      <Input
        value={value[1]}
        onChange={handleInputChange(1)}
        variant="outlined"
        slotProps={{
          htmlInput: { min, max },
        }}
      />
    </Box>
  )
}
