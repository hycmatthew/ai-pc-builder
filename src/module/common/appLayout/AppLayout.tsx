import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import './AppLayout.scss'
import config from '../../../config/config'
import HeaderLayout from './header'

type Props = {
  children: JSX.Element
  bgColor?: string
}

function AppLayout({ children, bgColor }: Props) {
  const location = useLocation()

  useEffect(() => {
    if (config.CURRENT_ENV !== 'dev') {
      ReactGA.send({ hitType: 'pageview', page: location.pathname })
    }
  }, [location])

  return (
    <Container maxWidth="xl">
      <HeaderLayout></HeaderLayout>
      <div className="main-page">{children}</div>
      <div>
        <Typography>
          {`©${new Date().getFullYear()} buildyourpc.com`}
        </Typography>
      </div>
    </Container>
  )
}

AppLayout.defaultProps = {
  bgColor: '#e7ebf0',
}

export default AppLayout
