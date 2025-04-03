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
)(
  ({
    theme,
    glowColor = theme.palette.primary.main,
    borderRadius = 8,
    hoverEffect = true,
    width,
  }) => ({
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
    // 基础样式
    '& .MuiFilledInput-root': {
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

      // 悬停效果
      ...(hoverEffect && {
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'dark' ? '#2D3843' : '#EBEEF3',
        },
      }),

      // 聚焦状态
      '&.Mui-focused': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2D3843' : '#FFFFFF',
        boxShadow: `${alpha(glowColor, 0.25)} 0 0 0 2px`,
        borderColor: glowColor,
      },

      // 禁用状态
      '&.Mui-disabled': {
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#F3F6F9',
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
  })
)

export default CustomTextField
