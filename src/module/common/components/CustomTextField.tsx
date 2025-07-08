import { alpha, styled } from '@mui/material/styles'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import { OutlinedInputProps } from '@mui/material/OutlinedInput'

interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  glowColor?: string
  borderRadius?: number
  hoverEffect?: boolean
  width?: string | number
}

const CustomTextField = styled(
  ({
    glowColor,
    borderRadius,
    hoverEffect,
    ...props
  }: CustomTextFieldProps) => (
    <TextField
      variant="filled"
      slotProps={{
        input: { disableUnderline: true } as Partial<OutlinedInputProps>,
      }}
      {...props}
    />
  ),
  {
    shouldForwardProp: (prop) =>
      !['glowColor', 'borderRadius', 'hoverEffect'].includes(prop.toString()),
  }
)(({ theme, borderRadius = 8, hoverEffect = true, width }) => ({
  width: width ? width : '100%',
  // 无标签时移除上边距
  '&:not(:has(.MuiFormLabel-root))': {
    '.MuiInputBase-input': {
      paddingTop: '8px',
    },
  },

  '& :before': {
    borderBottom: 'none !important',
  },
  label: {
    fontFamily:
      '"Noto Sans SC", "Noto Sans TC", "Open Sans", sans-serif, system-ui, Avenir, Helvetica',
  },
  // 基础样式
  '& .MuiFilledInput-root': {
    fontFamily:
      '"Noto Sans SC", "Noto Sans TC", "Open Sans", sans-serif, system-ui, Avenir, Helvetica',
    overflow: 'hidden',
    borderRadius,
    border: '2px solid',
    backgroundColor: '#F7FAFC',
    borderColor: 'transparent',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),

    // 悬停效果
    ...(hoverEffect && {
      '&:hover': {
        backgroundColor: '#E8EDF5',
      },
    }),

    // 聚焦状态
    '&.Mui-focused': {
      backgroundColor: '#FFFFFF',
      borderColor: '#CEDDF2',
    },

    // 禁用状态
    '&.Mui-disabled': {
      backgroundColor: '#E8EDF5',
      borderColor: theme.palette.mode === 'dark' ? '#2D3843' : '#E0E3E7',
      opacity: 0.7,
    },
  },

  // 错误状态
  '& .Mui-error': {
    borderColor: theme.palette.error.main,
    '&.Mui-focused': {
      boxShadow: `${alpha(theme.palette.error.main, 0.25)} 0 0 0 2px`,
    },
  },
}))

export default CustomTextField
