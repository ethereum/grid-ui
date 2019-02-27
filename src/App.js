import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import NavTabs from './NavTabs'
import theme from './theme'

export default class NewApp extends Component {
  static displayName = 'App'

  static propTypes = {}

  static defaultProps = {}

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <NavTabs />
      </MuiThemeProvider>
    )
  }
}
