import React, { useState, useMemo, useEffect } from 'react'
import { t } from 'i18next'
import { createTheme, styled, ThemeProvider } from '@mui/material/styles'
import { Link, useLocation } from 'react-router-dom'
import ReactGA from 'react-ga4'

import { Popover } from '@mui/material'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import MenuIcon from '@mui/icons-material/Menu'
import LanguageIcon from '@mui/icons-material/Language'
import Stack from '@mui/material/Stack'
import LanguageButtons from './components/LanguageButtons'

import './AppLayout.scss'
import config from '../../config/config'

type Props = {
  children: JSX.Element
  bgColor?: string
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,
      md: 720,
      lg: 900,
      xl: 1200,
    },
  },
  typography: {
    fontFamily: [
      'Calibri',
      'Tahoma',
      '"Helvetica Neue"',
      'Microsoft JhengHei',
      '"Apple Color Emoji"',
      'PingFang',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

const CustomAppLayout = styled(AppBar)({
  backgroundColor: '#ffffff',
  alpha: 0.5,
})

const CustomTypography = styled(Typography)({
  color: '#222222',
})

const TopGrid = styled(Grid)({
  height: '70px',
})

const ChildGrid = styled(Grid)({
  paddingTop: '80px !important',
  minHeight: '100vh',
  height: '100%',
})

const FooterGrid = styled(Grid)({
  height: '44px',
})

function AppLayout({ children, bgColor }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const pages = [
    { label: t('pc-builder'), link: '/' },
    { label: t('benchmark'), link: '/benchmarks' },
    { label: t('ai-list'), link: '/ai-build' },
    { label: t('database'), link: '/database' },
  ]

  useEffect(() => {
    if (config.CURRENT_ENV !== 'dev') {
      ReactGA.send({ hitType: 'pageview', page: location.pathname })
    }
  }, [location])

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLangMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setLangMenuOpen(!langMenuOpen)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setLangMenuOpen(false)
  }

  const DesktopMenu = useMemo(
    () => (
      <Container
        maxWidth="xl"
        sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          margin="auto"
        >
          <Grid item xs={2}>
            <CustomTypography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                fontSize: 0,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                textDecoration: 'none',
              }}
            >
              <img
                className="app-icon"
                alt="App Icon"
                src="assets/appIcon.png"
                height={58}
              />
            </CustomTypography>
          </Grid>
          <Grid className="header-link-grid" item xs={9}>
            <Stack direction="row" spacing={2}>
              {pages.map((page) => (
                <Link key={page.label} to={page.link}>
                  <Button sx={{ color: 'black', display: 'block' }}>
                    {page.label}
                  </Button>
                </Link>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={langMenuOpen ? 'long-menu' : undefined}
              aria-expanded={langMenuOpen ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleLangMenuClick}
            >
              <LanguageIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Popover
          open={langMenuOpen}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={handleClose}
        >
          <LanguageButtons />
        </Popover>
      </Container>
    ),
    [langMenuOpen] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const MobileMenu = useMemo(
    () => (
      <Container sx={{ display: { xs: 'block', sm: 'block', md: 'none' } }}>
        <Grid
          container
          sx={{ height: '70px' }}
          justifyContent="space-between"
          alignItems="center"
          margin="auto"
        >
          <Grid item xs={2}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMobileMenuClick}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Collapse in={mobileMenuOpen} timeout="auto" unmountOnExit>
          <Grid className="header-link-grid" container spacing={1}>
            {pages.map((page) => (
              <Grid item xs={12} key={page.label}>
                <Link to={page.link}>
                  <Button sx={{ color: 'black', display: 'block' }}>
                    {page.label}
                  </Button>
                </Link>
              </Grid>
            ))}
            <Grid item xs={12}>
              <LanguageButtons />
            </Grid>
          </Grid>
        </Collapse>
      </Container>
    ),
    [mobileMenuOpen] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <ThemeProvider theme={theme}>
      <Box
        display="flex"
        sx={{ background: bgColor }}
        className="main_container"
      >
        <Container maxWidth="xl">
          <Grid container spacing={1}>
            <TopGrid item xs={12}>
              <CustomAppLayout>
                {DesktopMenu}
                {MobileMenu}
              </CustomAppLayout>
            </TopGrid>

            <ChildGrid item xs={12}>
              {children}
            </ChildGrid>
            <FooterGrid item xs={12}>
              <Typography>
                {`©${new Date().getFullYear()} buildyourpc.com`}
              </Typography>
            </FooterGrid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

AppLayout.defaultProps = {
  bgColor: '#e7ebf0',
}

export default AppLayout
