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
import { OptionType } from '../../../constant/objectTypes'

type SelectElementProps = SelectProps & {
  label: string
  value?: string
  placeholder?: string
  extraNum?: number
  options: OptionType[]
  selectChange?: (value: string, type: string, num?: number) => void
  isLoading?: boolean
}

const CustomAutocomplete = styled(Autocomplete)({
  height: '60px',
  '& .MuiInputBase-input': {},
  // 边框状态管理
  '& .MuiTextField-root .MuiFilledInput-root': {
    borderColor: "#fbfbfb",
    background: "#fbfbfb",
    '&:hover fieldset': {
      borderColor: "#4287f5",
    },
    '&.Mui-focused fieldset': {
      borderColor: "#4287f5",
    },
  },
  // 下拉选项
  '& .MuiAutocomplete-paper': {
    backgroundColor: "#4287f5",
  }
})

const OptionTypography = styled(Typography)({
  fontFamily: ["Noto Sans TC", "Open Sans", "sans-serif", "system-ui", "Avenir", "Helvetica"],
  fontSize: '14px',
  padding: '2px 0px',
})

const ValueTypography = styled(Typography)({
  fontFamily: ["Noto Sans TC", "Open Sans", "sans-serif", "system-ui", "Avenir", "Helvetica"],
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
    borderRadius: 12,
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
}))

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  padding: '8px 12px',
  color: '#222222',
  fontSize: '12px',
}))

const GroupItems = styled('ul')({
  fontSize: '7px !important',
  padding: 0,
})

const SelectElement = ({
  label,
  options,
  value,
  extraNum,
  selectChange,
}: SelectElementProps) => {
  const { t } = useTranslation()
  const handleChange = (event: any, value: any) => {
    // 直接调用父组件回调
    if (selectChange) {
      console.log('value:', value)
      selectChange(value?.name || "", label, extraNum);
    }
  };

  // 根据传入的value查找当前选项
  const selectedOption = options.find(option => option.name === value) || null;

  return (
    <CustomAutocomplete
      disablePortal
      value={selectedOption}
      id={label}
      options={options}
      groupBy={(option: any) => option.brand}
      onChange={handleChange}
      isOptionEqualToValue={(option: any, value: any) =>
        option.model === value.model
      }
      getOptionDisabled={(option: any) => option.disabled === true}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{t(brandTranslationKey(params.group))}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
      /* eslint-disable react/jsx-props-no-spreading */
      renderOption={(props, option: any) => (
        <Box component="li" {...props} key={props.key}>
          <Stack
            sx={{ width: '100%' }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            // key={`${option.brand}-${option.name}`}
          >
            <OptionTypography>{option.label}</OptionTypography>
            <ValueTypography>{addCurrencySign(option.value)}</ValueTypography>
          </Stack>
        </Box>
      )}
      /* eslint-disable react/jsx-props-no-spreading */
      renderInput={(params) => (
        <CustomTextField
          {...params}
          label={t(label)}
          slotProps={{
            input: {
              ...params.InputProps,
              disableUnderline: true,
              ...(options.length === 0 && {
                endAdornment: (
                  <InputAdornment position="end">
                    <CircularProgress size={28} />
                  </InputAdornment>
                ),
              }),
            },
          }}
          variant="filled"
        />
      )}
    />
  )
}
/*
SelectElement.defaultProps = {
  placeholder: 'Select',
  selectChange: () => {},
  isLoading: false,
}
*/
export default SelectElement
