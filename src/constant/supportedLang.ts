interface LanguageType {
  lang: string
  code: string
  label: string
}

const langOptions: LanguageType[] = [
  { lang: 'en', code: 'us', label: 'English' },
  { lang: 'zh-CN', code: 'cn', label: '简体中文' },
  { lang: 'zh-TW', code: 'hk', label: '繁體中文' },
]

export const SUPPORTED_LANGS: string[] = langOptions.map(
  (option) => option.lang
)
export type LangType = (typeof SUPPORTED_LANGS)[number]
export const DEFAULT_LANG: LangType = 'en'

export const detectLanguage = (): LangType => {
  // 路径参数检测
  const pathLang = window.location.pathname.split('/')[1]
  if (isValidLang(pathLang)) return pathLang as LangType

  // 本地存储检测
  const storedLang = localStorage.getItem('preferredLang')
  if (storedLang && isValidLang(storedLang)) return storedLang as LangType

  // 浏览器语言检测
  const [browserLang] = navigator.language.split('-')
  return isValidLang(browserLang) ? (browserLang as LangType) : DEFAULT_LANG
}

export const isValidLang = (lang: string): boolean =>
  SUPPORTED_LANGS.includes(lang as LangType)

export default langOptions
