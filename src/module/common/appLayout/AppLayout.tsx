import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

import './AppLayout.scss'
import config from '../../../config/config'
import HeaderLayout from './header'
import CusTypography from '../components/CusTypography'
import { Dialog, DialogTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'

type Props = {
  children: JSX.Element
}

interface SimpleDialogProps {
  open: boolean
  onClose: () => void
  updateLang: (lang: string) => void
}

function SimpleDialog(props: SimpleDialogProps) {
  const LangMapping = {
    en: 'US | EN',
    'zh-CN': '簡體中文',
    'zh-TW': '繁體中文',
  }
  const { onClose, open } = props
  const { i18n } = useTranslation()

  const handleClose = () => {
    onClose()
  }

  const changeLanguage = (lng: keyof typeof LangMapping) => {
    i18n.changeLanguage(lng)
    props.updateLang(LangMapping[lng])
    handleClose()
  }

  return (
    <Dialog className="lang-dialog" onClose={handleClose} open={open}>
      <DialogTitle>Change Lanuage</DialogTitle>
      <div className="dialog-lang-btn-container">
      {Object.keys(LangMapping).map((lng) => (
          <button key={lng} onClick={() => changeLanguage(lng as keyof typeof LangMapping)}>
            {LangMapping[lng as keyof typeof LangMapping]}
          </button>
        ))}
      </div>
    </Dialog>
  )
}

function AppLayout({ children }: Props) {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [curLang, setCurLang] = useState('US | EN')

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
        <button onClick={handleClickOpen}>{curLang}</button>
        <SimpleDialog open={open} onClose={handleClose} updateLang={setCurLang} />
      </div>
    </div>
  )
}

export default AppLayout
