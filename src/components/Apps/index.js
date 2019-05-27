import React from 'react'
import Grid from '@material-ui/core/Grid'
import AppItem from './AppItem'
import GridAPI from '../../API/Grid'

class AppsOverview extends React.Component {
  state = {}

  render() {
    const apps = GridAPI.AppManager ? GridAPI.AppManager.getAvailableApps() : []

    return (
      <div style={{ width: '100%' }}>
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
    )
  }
}

export default AppsOverview
