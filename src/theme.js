import { createMuiTheme } from '@material-ui/core/styles'

const primary = '#3792E6'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    background: {
      default: '#ffffff'
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: primary
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: '#ffffff'
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
      // },
      // error: will use the default color
    }
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#ffffff'
      }
    },
    MuiTab: {
      textColorPrimary: {
        '&$disabled': {
          color: 'rgba(0, 0, 0, 0.2)'
        }
      }
    },
    MuiDrawer: {
      paper: {
        backgroundColor: '#f2f2f2'
      }
    }
  }
})

export default theme
