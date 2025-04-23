import Button, { ButtonProps } from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'

type CusButtonProps = ButtonProps & {
  /** 支持直接传递翻译键名或已翻译文本 */
  label?: ReactNode
}

const StyledButton = styled(Button)(({ theme }) => ({
  // 基礎樣式
  transition: theme.transitions.create(['all'], {
    duration: theme.transitions.duration.short,
  }),
  borderRadius: '8px',
  boxShadow: 'none',
  minWidth: '160px',
  maxWidth: '50%',
  // Contained variant 專用樣式
  backgroundColor: '#0077c0',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
  },
  '&:focus': {
    outline: 'none',
    boxShadow: 'none',
  },

  // 禁用狀態
  '&.Mui-disabled': {
    opacity: 0.7,
    backgroundColor: theme.palette.action.disabledBackground,
  },
}))

const CustomButton = ({
  label,
  variant,
  children,
  ...props
}: CusButtonProps) => {
  const resolvedVariant = variant ?? 'contained'
  const { t } = useTranslation()

  const variantStyles = {
    contained: {
    },
    outlined: {
      border: `1px solid #0077c0`,
      color: "#0077c0",
      backgroundColor: '#fff',
      "&:hover": {
        color: '#fff',
        backgroundColor: '#0077c0',
      }
    },
    text: {
      textDecoration: 'underline',
      padding: 0
    }
  }

  return (
    <StyledButton
      variant={resolvedVariant}
      {...props}
      sx={{
        ...variantStyles[variant || 'contained'], // 动态样式
        ...props.sx // 允许外部覆盖
      }}
    >
      {/* 優先顯示 children，其次處理翻譯 */}
      {children || (typeof label === 'string' ? t(label) : label)}
    </StyledButton>
  )
}

export default CustomButton
