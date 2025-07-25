import { IconButton, IconButtonProps } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'

type CusButtonProps = IconButtonProps & {
  /** 支持直接传递翻译键名或已翻译文本 */
  label?: ReactNode
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  // 基礎樣式
  color: '#fff',
  transition: theme.transitions.create(['all'], {
    duration: theme.transitions.duration.short,
  }),
  boxShadow: 'none',
  // Contained variant 專用樣式
  backgroundColor: '#0F1563',
  '&:hover': {
    backgroundColor: '#383D7E',
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

const CustomIconButton = ({ label, children, ...props }: CusButtonProps) => {
  const { t } = useTranslation()
  return (
    <StyledIconButton
      {...props}
      sx={{
        ...props.sx, // 允许外部覆盖
      }}
    >
      {/* 優先顯示 children，其次處理翻譯 */}
      {children || (typeof label === 'string' ? t(label) : label)}
    </StyledIconButton>
  )
}

export default CustomIconButton
