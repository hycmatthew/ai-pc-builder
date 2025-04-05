import { alpha, styled } from '@mui/material/styles'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import type { AutocompleteProps } from '@mui/material/Autocomplete'

interface CustomAutocompleteProps
  extends Omit<AutocompleteProps<any, any, any, any>, 'renderInput'> {
  glowColor?: string
  borderRadius?: number
  hoverEffect?: boolean
  width?: string | number
  label?: string
}

const CustomAutocomplete = styled(
  ({
    glowColor,
    borderRadius,
    hoverEffect,
    width,
    label,
    ...props
  }: CustomAutocompleteProps) => (
    <Autocomplete
      {...props}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={label}
          InputProps={{
            ...params.InputProps,
            disableUnderline: true,
          }}
        />
      )}
    />
  ),
  {
    shouldForwardProp: (prop) =>
      !['glowColor', 'borderRadius', 'hoverEffect', 'width'].includes(
        prop.toString()
      ),
  }
)(
  ({
    theme,
    glowColor = theme.palette.primary.main,
    borderRadius = 8,
    hoverEffect = true,
    width,
  }) => ({
    width: width || '100%',
    fontFamily:
      '"Noto Sans SC", "Noto Sans TC", "Open Sans", sans-serif, system-ui, Avenir, Helvetica',

    // 輸入框樣式
    '& .MuiFilledInput-root': {
      fontFamily: 'inherit',
      overflow: 'hidden',
      borderRadius,
      border: '1px solid',
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#F3F6F9',
      borderColor: theme.palette.mode === 'dark' ? '#2D3843' : '#E0E3E7',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),

      ...(hoverEffect && {
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2D3843' : '#EBEEF3',
        },
      }),

      '&.Mui-focused': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2D3843' : '#FFFFFF',
        boxShadow: `${alpha(glowColor, 0.25)} 0 0 0 2px`,
        borderColor: glowColor,
      },

      '&.Mui-disabled': {
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#F3F6F9',
        borderColor: theme.palette.mode === 'dark' ? '#2D3843' : '#E0E3E7',
        opacity: 0.7,
      },
    },

    // 錯誤狀態
    '& .Mui-error': {
      borderColor: theme.palette.error.main,
      '&.Mui-focused': {
        boxShadow: `${alpha(theme.palette.error.main, 0.25)} 0 0 0 2px`,
      },
    },

    // 下拉圖標
    '& .MuiAutocomplete-popupIndicator': {
      color: theme.palette.mode === 'dark' ? '#99CCFF' : '#666666',
    },

    // 下拉選單樣式
    '& .MuiAutocomplete-paper': {
      borderRadius,
      marginTop: theme.spacing(1),
      backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#FFFFFF',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: theme.shadows[2],
    },

    // 選項樣式
    '& .MuiAutocomplete-option': {
      '&.Mui-focused': {
        backgroundColor: alpha(glowColor, 0.1),
      },
      '&[aria-selected="true"]': {
        backgroundColor: alpha(glowColor, 0.2),
      },
    },

    // 標籤樣式
    '& .MuiInputLabel-root': {
      fontFamily: 'inherit',
      color: theme.palette.text.secondary,
      '&.Mui-focused': {
        color: glowColor,
      },
    },
  })
)

export default CustomAutocomplete
