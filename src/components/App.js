import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { darkTheme, lightTheme } from '../theme'
import HelpFab from './shared/HelpFab'
import ErrorBoundary from './GenericErrorBoundary'
import Plugins from './Plugins'

export default class NewApp extends Component {
  static displayName = 'App'

  static propTypes = {
    themeMode: PropTypes.oneOf(['dark', 'light'])
  }

  render() {
    const { themeMode } = this.props
    return (
      <MuiThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <HelpFab />
        <ErrorBoundary>
          <Plugins />
        </ErrorBoundary>
      </MuiThemeProvider>
    )
  }
}
