import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  CircularProgress,
  InputAdornment,
  SelectProps,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { addCurrencySign } from '../../../utils/NumberHelper'
import { brandTranslationKey } from '../../../utils/LabelHelper'

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

const CustomAutocomplete = styled(Autocomplete)({
  height: '60px',
})

const ValueTypography = styled(Typography)({
  fontSize: '12px',
  fontWeight: 'bold',
  fontStyle: 'italic',
  color: '#555',
  marginLeft: 'auto',
})

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    border: '1px solid #e2e2e1',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#fff',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    '&:hover': {
      backgroundColor: '#f2f2f2',
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
    },
  },
}));

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  padding: '8px 12px',
  color: '#222222',
  fontSize: '12px',
}));

const GroupItems = styled('ul')({
  fontSize: '7px !important',
  padding: 0
});

const SelectElement = ({
  isLoading,
  label,
  options,
  selectChange,
}: SelectElementProps) => {
  const { t } = useTranslation()

  const handleChange = (event: any, newValue: any) => {
    if (selectChange) {
      selectChange(newValue ? newValue.model : '', label)
    }
  }

  if (options.length === 0) {
    return (
      <CustomAutocomplete
        disabled
        renderInput={(params) => (
          /* eslint-disable react/jsx-props-no-spreading */
          <CustomTextField
            {...params}
            label={t(label)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CircularProgress size={28} />
                </InputAdornment>
              ),
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
      getOptionDisabled={(option: any) => option.disabled === true}
      renderGroup={(params) => (
        <li>
          <GroupHeader>{t(brandTranslationKey(params.group))}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
      /* eslint-disable react/jsx-props-no-spreading */
      renderOption={(props, option: any) => (
        <Box component="li" {...props}>
          <Stack
            sx={{ width: '100%' }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
          >
            <Typography>{option.label}</Typography>
            <ValueTypography>
              {addCurrencySign(option.value)}
            </ValueTypography>
          </Stack>
        </Box>
      )}
      /* eslint-disable react/jsx-props-no-spreading */
      renderInput={(params) => <CustomTextField {...params} label={t(label)} variant="filled" />}
    />
  )
}

SelectElement.defaultProps = {
  placeholder: 'Select',
  selectChange: () => {},
  isLoading: false,
}

export default SelectElement
