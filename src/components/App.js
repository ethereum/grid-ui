import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import NavTabs from './NavTabs'
import theme from '../theme'
import HelpFab from './shared/HelpFab'
import ErrorBoundary from './GenericErrorBoundary'

export default class NewApp extends Component {
  static displayName = 'App'

  static propTypes = {}

  static defaultProps = {}

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <NavTabs />
        </ErrorBoundary>
        <HelpFab />
      </MuiThemeProvider>
    )
  }
}
