import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import NavTabs from './NavTabs'

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#4185DE'
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    }
    // secondary: {
    // light: '#0066ff',
    // main: '#0044ff',
    // dark: will be calculated from palette.secondary.main,
    // contrastText: '#ffcc00',
    // },
    // error: will use the default color
  }
})

export default class NewApp extends Component {
  static displayName = 'App'

  static propTypes = {}

  static defaultProps = {}

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <NavTabs />
      </MuiThemeProvider>
    )
  }
}
