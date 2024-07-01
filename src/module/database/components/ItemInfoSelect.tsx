import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  CircularProgress,
  FormControl,
  SelectProps,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'

const CustomFormControl = styled(FormControl)({
  position: 'relative',
  width: '100%',
  background: '#fff',
  borderRadius: 3,
})

const CustomAutocomplete = styled(Autocomplete)({
  height: '60px',
})

interface OptionType {
  model: string
  brand: string
  label: string
  value: any
  disabled: boolean
}

type SelectElementProps = SelectProps & {
  label: string
  placeholder?: string
  options: OptionType[]
  selectChange?: (value: string, type: string) => void
  isLoading?: boolean
}

const ItemInfoSelect = ({
  isLoading,
  label,
  options,
  selectChange,
}: SelectElementProps) => {
  // const [selectValue, setSelectValue] = useState('')
  const { t } = useTranslation()

  const handleChange = (event: any, newValue: any) => {
    if (selectChange && newValue) {
      selectChange(newValue.model, label)
    }
  }

  if (isLoading) {
    return (
      <CustomAutocomplete
        id="outlined-disabled"
        renderInput={(params) => (
          <CircularProgress
            size={24}
            sx={{
              color: '#9e9e9e',
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              margin: 'auto',
              zIndex: 1,
            }}
          />
        )}
        options={[]}
      />
    )
  }

  return (
    <CustomAutocomplete
      disablePortal
      id={label}
      options={options}
      groupBy={(option: any) => option.brand}
      onChange={handleChange}
      isOptionEqualToValue={(option: any, value: any) => option.model === value.model}
      /* eslint-disable react/jsx-props-no-spreading */
      renderOption={(props, option: any) => (
        <Box component="li" {...props}>
          <Stack sx={{ width: '100%' }} direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <Typography>{option.label}</Typography>
          </Stack>
        </Box>
      )}
      /* eslint-disable react/jsx-props-no-spreading */
      renderInput={(params) => <TextField {...params} label={t(label)} />}
    />
  )
}

ItemInfoSelect.defaultProps = {
  placeholder: 'Select',
  selectChange: () => {},
  isLoading: false,
}

export default ItemInfoSelect
