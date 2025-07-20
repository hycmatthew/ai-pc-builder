import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Noto Sans SC", "Noto Sans TC", "Open Sans", sans-serif, system-ui, Avenir, Helvetica',
    ].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily:
            '"Noto Sans SC", "Noto Sans TC", "Open Sans", sans-serif, system-ui, Avenir, Helvetica',
        },
      },
    },
  },
})

export default theme
