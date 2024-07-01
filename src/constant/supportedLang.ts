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

export default langOptions
