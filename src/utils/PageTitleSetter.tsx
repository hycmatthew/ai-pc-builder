import { useLocation } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

const PAGE_TITLES: Record<string, string> = {
  '/': 'page-home',
  '/benchmarks': 'page-benchmarks',
  '/ai-build': 'page-aiBuild',
  '/database': 'page-database',
}

const PageTitleSetter = () => {
  const location = useLocation()

  // 从路径中提取当前页面键
  const getCurrentPageKey = () => {
    const pathSegments = location.pathname.split('/')
    // 路径格式: /:lang/:page
    const pagePath = pathSegments.length >= 3 ? `/${pathSegments[2]}` : '/'
    return pagePath
  }

  const currentPageKey = getCurrentPageKey()
  const titleKey = PAGE_TITLES[currentPageKey] || PAGE_TITLES['/']

  // 使用自定义Hook设置页面标题
  usePageTitle(titleKey)

  return null // 此组件不渲染任何UI
}

export default PageTitleSetter
