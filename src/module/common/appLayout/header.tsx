import { t } from 'i18next'
import { Link } from 'react-router-dom'
import './header.scss'
import i18n from '../../../config/i18n'

const HeaderLayout = () => {
  const pages = [
    { label: t('pc-builder'), link: '/' },
    { label: t('benchmark'), link: `/${i18n.language}/benchmarks` },
    { label: t('ai-builder'), link: `/${i18n.language}/ai-build` },
    // { label: t('pc-builds'), link: `/${i18n.language}/completed-builds` },
    { label: t('database'), link: `/${i18n.language}/database` },
  ]

  return (
    <header>
      <div className="header-menu-container">
        <div className="header-icon">
          <h3>BuildYourPC.com</h3>
        </div>
        <div className="header-menu">
          <div className="menu-list-container">
            {pages.map((page) => (
              <div key={page.label} className="menu-item">
                <Link to={page.link}>{page.label}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderLayout
