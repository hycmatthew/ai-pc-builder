import { Routes, Route, Navigate } from 'react-router-dom'

import Benchmarks from './module/benchmark/Benchmarks'
import MainPage from './module/componentList/MainPage'
import AILogicPage from './module/aiComponentList/AILogicPage'
import Database from './module/database/page/Database'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

function AppRoutes() {
  const { i18n } = useTranslation()
  const currentLang = window.location.pathname.split('/')[1] || 'en'

  useEffect(() => {
    console.log('currentLang', currentLang)
    i18n.changeLanguage(currentLang)
  }, [currentLang, i18n])

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

function LangRedirector() {
  const browserLang = navigator.language.split('-')[0] // 获取浏览器语言
  const supportedLangs = ['en', 'zh', 'es'] // 支持的语言列表

  return (
    <Navigate
      to={`/${supportedLangs.includes(browserLang) ? browserLang : 'en'}`}
    />
  )
}

export default AppRoutes
