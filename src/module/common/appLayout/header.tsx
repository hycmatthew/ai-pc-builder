import { t } from 'i18next'
import { Link } from 'react-router-dom'
import './header.scss'
import { linkHandler } from '../../../utils/LinkHelper'

const HeaderLayout = () => {
  const pages = [
    { label: t('pc-builder'), link: '/' },
    { label: t('benchmark'), link: linkHandler('benchmarks') },
    { label: t('ai-builder'), link: linkHandler('ai-build') },
    // { label: t('pc-builds'), link: `/${i18n.language}/completed-builds` },
    { label: t('database'), link: linkHandler('database') },
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
