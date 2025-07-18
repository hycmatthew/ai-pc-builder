import { useEffect, useState, useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogTitle } from '@mui/material'

import './AppLayout.scss'
import config from '../../../config/config'
import HeaderLayout from './header'
import CusTypography from '../components/CusTypography'
import { LangEnum } from '../../../constant/supportedLang'
import { t } from 'i18next'

// 类型定义
type AppLayoutProps = {
  children: React.ReactNode
}

type LanguageConfig = {
  code: string
  displayText: string
}

// 全局语言配置
const LANGUAGE_MAPPING: Record<string, LanguageConfig> = {
  en: { code: LangEnum.en, displayText: 'EN' },
  'zh-CN': { code: LangEnum.zhCN, displayText: '简' },
  'zh-TW': { code: LangEnum.zhTW, displayText: '繁' },
}

// 提取独立Dialog组件
interface LanguageDialogProps {
  open: boolean
  onClose: () => void
  currentLanguage: string
  onChangeLanguage: (lang: string) => void
}

const LanguageDialog = ({
  open,
  onClose,
  currentLanguage,
  onChangeLanguage,
}: LanguageDialogProps) => {
  const { i18n } = useTranslation()

  const handleLanguageChange = useCallback(
    async (lng: string) => {
      await i18n.changeLanguage(lng)
      onChangeLanguage(lng)
      onClose()
    },
    [i18n, onChangeLanguage, onClose]
  )

  return (
    <Dialog className="lang-dialog" onClose={onClose} open={open}>
      <DialogTitle>{t('select-language')}</DialogTitle>
      <div className="dialog-lang-btn-container">
        {Object.values(LANGUAGE_MAPPING).map((lang) => (
          <button
            key={lang.code}
            className={`app-layout-lang-btn ${
              currentLanguage === lang.code ? 'active' : ''
            }`}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.displayText}
          </button>
        ))}
      </div>
    </Dialog>
  )
}

// 主组件
const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation()
  const { i18n } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(i18n.language)

  // GA跟踪
  useEffect(() => {
    if (config.CURRENT_ENV !== 'dev') {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname,
        language: currentLang, // 添加语言维度
      })
    }
  }, [location, currentLang])

  // 语言变化监听
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng)
    }
    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  // 当前语言显示配置
  const currentLanguageConfig = useMemo(
    () => LANGUAGE_MAPPING[currentLang] || LANGUAGE_MAPPING.en,
    [currentLang]
  )

  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
  }, [])

  return (
    <div className="app-layout">
      <HeaderLayout />

      <main className="main-page">{children}</main>

      <footer>
        <div className="main-container">
          <CusTypography variant="body2">
            {`©${new Date().getFullYear()} buildyourpc.com`}
          </CusTypography>

          <button
            className="app-layout__current-lang"
            onClick={handleDialogOpen}
          >
            {currentLanguageConfig.displayText}
          </button>
        </div>
      </footer>

      <LanguageDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        currentLanguage={currentLang}
        onChangeLanguage={setCurrentLang}
      />
    </div>
  )
}

export default AppLayout
