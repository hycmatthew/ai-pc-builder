import { t } from 'i18next'
import { Link } from 'react-router-dom'
import { useLinkHandler } from '../../../utils/LinkHelper'
import { useTheme, Theme } from '@mui/material/styles'
import {
  useMediaQuery,
  IconButton,
  Box,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Drawer,
} from '@mui/material'
import { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

import './header.scss'

const HeaderLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const theme = useTheme<Theme>()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const linkHandler = useLinkHandler()

  const pages = [
    { label: t('page-pc-builder'), link: '/' },
    { label: t('page-benchmark'), link: linkHandler('benchmarks') },
    { label: t('page-ai-builder'), link: linkHandler('ai-build') },
    { label: t('page-database'), link: linkHandler('database') },
  ]

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }
      setDrawerOpen(open)
    }

  const renderDesktopMenu = () => (
    <div className="menu-list-container">
      {pages.map((page) => (
        <div key={page.label} className="menu-item">
          <Link to={page.link}>{page.label}</Link>
        </div>
      ))}
    </div>
  )

  const renderMobileMenu = () => (
    <div className="mobile-menu-button">
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
    </div>
  )

  const drawerContent = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {pages.map((page) => (
          <ListItem
            key={page.label}
            component={Link}
            to={page.link}
            onClick={toggleDrawer(false)}
          >
            <ListItemText primary={page.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <header>
      <div className="header-menu-container">
        <div className="header-icon">
          <Box
            component="img"
            src="/icon/aipcbuild-icon.png"
            alt="BuildYourPC Custom Computers"
            sx={{
              height: 60,
              width: 'auto',
              padding: '8px 0', // 垂直留白
            }}
          />
        </div>
        <div className="header-menu">
          {isMobile ? renderMobileMenu() : renderDesktopMenu()}
        </div>
      </div>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent()}
      </Drawer>
    </header>
  )
}

export default HeaderLayout
