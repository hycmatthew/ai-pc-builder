import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

import './AppLayout.scss'
import config from '../../../config/config'
import HeaderLayout from './header'
import CusTypography from '../components/CusTypography'

type Props = {
  children: JSX.Element
}

function AppLayout({ children }: Props) {
  const location = useLocation()

  useEffect(() => {
    if (config.CURRENT_ENV !== 'dev') {
      ReactGA.send({ hitType: 'pageview', page: location.pathname })
    }
  }, [location])

  return (
    <div>
      <HeaderLayout></HeaderLayout>
      <div className="main-page">{children}</div>
      <div className='main-container'>
        <CusTypography variant='body1'>
          {`©${new Date().getFullYear()} buildyourpc.com`}
        </CusTypography>
      </div>
    </div>
  )
}

AppLayout.defaultProps = {
  bgColor: '#e7ebf0',
}

export default AppLayout
