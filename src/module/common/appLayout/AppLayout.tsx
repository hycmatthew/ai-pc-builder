import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

import './AppLayout.scss'
import config from '../../../config/config'
import HeaderLayout from './header'
import CusTypography from '../components/CusTypography'
import { Button, Dialog, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  children: JSX.Element
}

interface SimpleDialogProps {
  open: boolean
  onClose: () => void
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props

  const handleClose = () => {
    onClose()
  }

  const handleListItemClick = (value: string) => {
    onClose()
  }

  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    handleClose()
  }

  return (
    <Dialog className="lang-dialog" onClose={handleClose} open={open}>
      <DialogTitle>Change Lanuage</DialogTitle>
      <div className="dialog-lang-btn-container">
        <button onClick={() => changeLanguage('zh-CN')}>中文</button>
        <button onClick={() => changeLanguage('en')}>English</button>
      </div>
    </Dialog>
  )
}

function AppLayout({ children }: Props) {
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (config.CURRENT_ENV !== 'dev') {
      ReactGA.send({ hitType: 'pageview', page: location.pathname })
    }
  }, [location])

  return (
    <div>
      <HeaderLayout></HeaderLayout>
      <div className="main-page">{children}</div>
      <div className="main-container">
        <CusTypography variant="body1">
          {`©${new Date().getFullYear()} buildyourpc.com`}
        </CusTypography>
        <button onClick={handleClickOpen}>4123</button>
        <SimpleDialog open={open} onClose={handleClose} />
      </div>
    </div>
  )
}

export default AppLayout
