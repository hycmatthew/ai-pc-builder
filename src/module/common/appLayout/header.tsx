import { t } from 'i18next'
import { Link } from 'react-router-dom'
import './header.scss'

const HeaderLayout = () => {
  const pages = [
    { label: t('pc-builder'), link: '/' },
    { label: t('benchmark'), link: '/benchmarks' },
    { label: t('ai-list'), link: '/ai-build' },
    { label: t('database'), link: '/database' },
  ]

  return (
    <header>
      <div className="header-container">
        <div className="header-menu-container">
          <div className="header-icon">
            <h3>Header</h3>
          </div>
          <div className="header-menu">
            <div className="menu-list-container">
              {pages.map((page) => (
                <div className="menu-item">
                  <Link key={page.label} to={page.link}>
                    {page.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderLayout
