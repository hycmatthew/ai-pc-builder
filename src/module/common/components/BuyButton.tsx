import Button, { ButtonProps } from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { ReactNode } from 'react'
import { Link } from '@mui/material'
import { color } from 'framer-motion'

type CusButtonProps = ButtonProps & {
  /** 支持直接传递翻译键名或已翻译文本 */
  label?: ReactNode
}

const StyledLink = styled(Link)(({ theme }) => ({
  // 基礎樣式
  transition: theme.transitions.create(['all'], {
    duration: theme.transitions.duration.short,
  }),
  borderRadius: '16px',
  backgroundColor: '#fba126',
  boxShadow: 'none',
  fontSize: '16px',
  verticalAlign: 'middle',
  color: '#fff',
  textDecoration: 'none',
  marginRight: '16px',

  float: 'right',
  padding: '4px 16px',

  // 禁用狀態
  '&:hover': {
    color: '#fff',
    backgroundColor: '#fa9409',
  },
  '&.Mui-disabled': {
    opacity: 0.7,
    backgroundColor: theme.palette.action.disabledBackground,
  },
}))

const BuyButton = ({ label, children, ...props }: CusButtonProps) => {
  const { t } = useTranslation()

  return (
    <StyledLink href={props.href} target="_blank">
      {/* 使用 Link 组件包裹按钮 */}
      {children || (typeof label === 'string' ? t(label) : label)}
    </StyledLink>
  )
}

export default BuyButton
