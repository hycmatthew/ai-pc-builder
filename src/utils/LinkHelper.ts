import { useLocation } from 'react-router-dom'

export const useLinkHandler = () => {
  const location = useLocation()

  return (link: string) => {
    // 从当前 URL 中提取语言部分
    const lang = location.pathname.split('/')[1]
    return `/${lang}/${link.replace(/^\//, '')}` // 确保没有重复的斜杠
  }
}
