/* eslint-disable no-unused-vars */
import { createMuiTheme } from '@material-ui/core/styles'

export const primary = '#4fb783' // green
export const primary2 = '#78aac7' // blue
export const primary3 = '#5d63b3' // purple

const darkTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    type: 'dark',

    primary: {
      main: primary
    },
    secondary: {
      main: primary2
    },
    background: {
      default: '#35393E'
    }
    // primary: {
    //   // light: will be calculated from palette.primary.main,
    //   main: primary,
    //   // dark: will be calculated from palette.primary.main,
    //   contrastText: '#ffffff' // will be calculated to contrast with palette.primary.main
    // },
    // secondary: {
    //   // light: '#0066ff',
    //   main: '#ffffff'
    //   // dark: will be calculated from palette.secondary.main,
    //   // contrastText: '#ffcc00',
    //   // },
    //   // error: will use the default color
    // }
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#202225'
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
        backgroundColor: '#2E3137'
      }
    }
  }
})

const lightTheme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    background: {
      default: '#ffffff'
    },
    primary: {
      // light: will be calculated from palette.primary.main,
      main: primary,
      // dark: will be calculated from palette.primary.main,
      contrastText: '#ffffff' // will be calculated to contrast with palette.primary.main
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

export { lightTheme, darkTheme }
