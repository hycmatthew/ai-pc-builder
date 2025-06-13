import i18n from '../config/i18n'

export const linkHandler = (link: string): string => {
  return `/${i18n.language}/${link}`
}
