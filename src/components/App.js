import React, { Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import NavTabs from './NavTabs'
import { darkTheme, lightTheme } from '../theme'
import HelpFab from './shared/HelpFab'
import ErrorBoundary from './GenericErrorBoundary'

export default class NewApp extends Component {
  static displayName = 'App'

  static propTypes = {}

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.state = {
      currentTheme: darkTheme
    }
  }

  render() {
    const { currentTheme } = this.state
    return (
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        <HelpFab />
        <ErrorBoundary>
          <NavTabs />
        </ErrorBoundary>
      </MuiThemeProvider>
    )
  }
}
