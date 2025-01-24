import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider, { SliderProps } from '@mui/material/Slider'
import MuiInput from '@mui/material/Input'
import { Grid2 as Grid } from "@mui/material"

const Input = styled(MuiInput)`
  width: 84px;
`

type PriceSliderProps = SliderProps & {
  selectChange?: (value: number) => void
}

const PriceSlider = ({ selectChange }: PriceSliderProps) => {
  const { t, i18n } = useTranslation()
  const getMaximunNumber = () => {
    switch (i18n.language) {
      case 'zh-TW':
        return 30000
      case 'zh-CN':
        return 30000
      default:
        return 4000
    }
  }
  const [value, setValue] = React.useState<
    number | string | Array<number | string>
  >(getMaximunNumber())

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number' && selectChange) {
      selectChange(newValue)
    }
    setValue(newValue)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleBlur = () => {
    /*
    if (value < 0) {
      setValue(0)
    } else if (value > getMaximunNumber()) {
      setValue(getMaximunNumber())
    }
    */
  }

  return (
    <Box>
      <Typography id="input-slider" gutterBottom>
        {t('price')}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid>
          <Slider
            min={0}
            step={10}
            max={getMaximunNumber()}
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 100,
              min: 0,
              max: getMaximunNumber(),
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

PriceSlider.defaultProps = {
  selectChange: () => {},
}

export default PriceSlider
