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

  // Contained variant 專用樣式
  backgroundColor: theme.palette.primary.main,
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

const CusButton = ({
  label,
  children,
  ...props
}: CusButtonProps) => {
  const { t } = useTranslation()

  return (
    <StyledButton
      {...props}
      variant="contained" // 强制指定 variant
    >
      {/* 優先顯示 children，其次處理翻譯 */}
      {children || (typeof label === 'string' ? t(label) : label)}
    </StyledButton>
  )
}

export default CusButton
