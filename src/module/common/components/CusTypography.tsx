import Typography, { TypographyProps } from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import React from 'react'

// 將 theme 提取到組件外避免重複創建
const customTheme = createTheme({
  typography: {
    fontFamily: '"Noto Sans TC", "Open Sans", sans-serif, system-ui, Avenir, Helvetica',
    h1: { fontSize: '2.5rem', fontWeight: 600, marginBottom: '1rem' },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },
    h5: { fontSize: '1rem', fontWeight: 600 },
    h6: { fontSize: '0.875rem' },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 }
  }
})

// 擴展 Props 以支持多個 children 和其他 Typography 屬性
interface CusTypographyProps extends TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2'
  children?: React.ReactNode
}

// 緩存 ThemeProvider 組件以避免不必要的重新渲染
const CachedThemeProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={customTheme}>{children}</ThemeProvider>
)

export default function CusTypography({
  variant,
  children,
  ...restProps // 接收其他 Typography 屬性
}: CusTypographyProps) {
  return (
    <CachedThemeProvider>
      <Typography variant={variant} {...restProps}>
        {children}
      </Typography>
    </CachedThemeProvider>
  )
}