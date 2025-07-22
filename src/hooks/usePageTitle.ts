import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const usePageTitle = (titleKey: string) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (titleKey) {
      // 获取翻译后的标题
      const translatedTitle = t(titleKey)

      // 设置文档标题
      document.title = `${translatedTitle} | BuildYourPC`

      // 可选：为搜索引擎设置元描述
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', t(`${titleKey}-desc`))
      }
    }
  }, [t, titleKey])
}
