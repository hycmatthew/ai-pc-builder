import { useEffect, useState, useCallback, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ReactGA from 'react-ga4'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogTitle } from '@mui/material'

import './AppLayout.scss'
import config from '../../../config/config'
import HeaderLayout from './header'
import CusTypography from '../components/CusTypography'
import { LangEnum } from '../../../constant/supportedLang'
import { t } from 'i18next'
import PageTitleSetter from '../../../utils/PageTitleSetter'

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
  [LangEnum.en]: { code: LangEnum.en, displayText: 'EN' },
  [LangEnum.zhCN]: { code: LangEnum.zhCN, displayText: '简' },
  [LangEnum.zhTW]: { code: LangEnum.zhTW, displayText: '繁' },
}

// 语言代码规范化函数
const normalizeLanguageCode = (lang: string | undefined): LangEnum => {
  if (!lang) return LangEnum.en

  const normalized = lang.toLowerCase().replace(/_/g, '-')

  if (normalized === 'zh-cn' || normalized === 'zh-hans') return LangEnum.zhCN
  if (normalized === 'zh-tw' || normalized === 'zh-hant') return LangEnum.zhTW
  if (normalized === 'en' || normalized === 'en-us') return LangEnum.en

  return LangEnum.en
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
            onClick={() => onChangeLanguage(lang.code)}
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
  const navigate = useNavigate()
  const params = useParams()
  const { i18n } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)

  const currentLang = useMemo(() => {
    const langFromParams = params.lang
      ? normalizeLanguageCode(params.lang)
      : undefined
    const langFromi18n = normalizeLanguageCode(i18n.language)
    return langFromParams || langFromi18n || LangEnum.en
  }, [params.lang, i18n.language])

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
    // 确保i18n语言与路由参数同步
    if (params.lang && params.lang !== i18n.language) {
      i18n.changeLanguage(params.lang)
    }
  }, [params.lang, i18n])

  // 处理语言变更
  const handleChangeLanguage = useCallback(
    async (lang: string) => {
      const newLang = normalizeLanguageCode(lang)

      // 1. 更新i18n语言
      await i18n.changeLanguage(newLang)

      // 2. 获取当前路径并替换语言部分
      const pathSegments = location.pathname.split('/')

      // 确保路径至少有两段（语言段 + 其他）
      if (pathSegments.length >= 2) {
        // 替换语言部分
        pathSegments[1] = newLang
        const newPath = pathSegments.join('/')

        // 3. 导航到新路径
        navigate(newPath)
      } else {
        // 如果路径不符合预期，导航到新语言的首页
        navigate(`/${newLang}`)
      }
    },
    [i18n, location.pathname, navigate]
  )

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
      <PageTitleSetter />
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
        onChangeLanguage={handleChangeLanguage}
      />
    </div>
  )
}

export default AppLayout
