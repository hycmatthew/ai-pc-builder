import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SelectProps, TextField, alpha } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'

const CustomAutocomplete = styled(Autocomplete)({
  height: '60px',
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

interface OptionsType {
  label: string,
  value: string
}

type SelectFiltertProps = SelectProps & {
  label: string
  placeholder?: string
  options: OptionsType[]
  selectChange?: (value: string) => void
}

const SelectFilter = ({ label, options, selectChange }: SelectFiltertProps) => {
  const { t } = useTranslation()

  const handleChange = (event: any, newValue: any) => {
    if (selectChange) {
      selectChange(newValue.value)
    }
  }

  return (
    <CustomAutocomplete
      disablePortal
      id={label}
      options={options}
      onChange={handleChange}
      /* eslint-disable react/jsx-props-no-spreading */
      renderInput={(params) => <CustomTextField {...params} label={t(label)} variant="filled" />}
      getOptionLabel={(option: any) => t(option.label)}
    />
  )
}

SelectFilter.defaultProps = {
  placeholder: 'Select',
  selectChange: () => {},
}

export default SelectFilter
