import React from 'react'
import Grid from '@material-ui/core/Grid'
import { MuiThemeProvider } from '@material-ui/core/styles'
import AppItem from './AppItem'
import GridAPI from '../../API/Grid'
import { darkTheme } from '../../theme'

class AppsOverview extends React.Component {
  state = {}

  render() {
    const apps = GridAPI.AppManager ? GridAPI.AppManager.getAvailableApps() : []

    return (
      <MuiThemeProvider theme={darkTheme}>
        <div style={{ width: '100%', paddingBottom: '64px' }}>
          <Grid container spacing={24}>
            {apps.length ? (
              apps.map(app => (
                <Grid item xs={4} key={app.name}>
                  <AppItem app={app} />
                </Grid>
              ))
            ) : (
              <span>no apps found</span>
            )}
          </Grid>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default AppsOverview
