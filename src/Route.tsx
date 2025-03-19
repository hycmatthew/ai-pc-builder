import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Benchmarks from './module/benchmark/Benchmarks'
import MainPage from './module/componentList/MainPage'
import AILogicPage from './module/aiComponentList/AILogicPage'
import Database from './module/database/page/Database'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { detectLanguage, isValidLang } from './constant/supportedLang'

function AppRoutes() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const initialLang = detectLanguage()

  useEffect(() => {
    const initialize = async () => {
      // 同步i18n与URL
      await i18n.changeLanguage(initialLang)
      if (!window.location.pathname.startsWith(`/${initialLang}`)) {
        navigate(`/${initialLang}`, { replace: true })
      }
    }
    initialize()
  }, [])

  // 语言切换统一处理
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      if (isValidLang(lng)) {
        localStorage.setItem('preferredLang', lng)
        navigate(`/${lng}`, { replace: true })
      }
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => i18n.off('languageChanged', handleLanguageChange)
  }, [navigate])

  /*
  useEffect(() => {
    console.log('currentLang', currentLang)
    i18n.changeLanguage(currentLang)
  }, [currentLang, i18n])
  */
  return (
    <Routes>
      <Route path=":lang">
        <Route index element={<MainPage />} />
        <Route path="benchmarks" element={<Benchmarks />} />
        <Route path="ai-build" element={<AILogicPage />} />
        <Route path="database" element={<Database />} />
      </Route>
      <Route path="*" element={<LangRedirector />} />
    </Routes>
  )
}
const LangRedirector = () => <Navigate to={`/${detectLanguage()}`} replace />
export default AppRoutes
