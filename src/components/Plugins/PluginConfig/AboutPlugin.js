import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import GridAPI from '../../../API/Grid'
import AppItem from '../../Apps/AppItem'

const styles = {
  spacing: {
    marginTop: 30
  },
  headerText: {
    fontWeight: 'bold'
  },
  link: {
    display: 'block',
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}

class AboutPlugin extends Component {
  static propTypes = {
    plugin: PropTypes.object.isRequired,
    pluginState: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
  }

  state = {
    gridApps: []
  }

  async componentDidMount() {
    const gridApps = await GridAPI.AppManager.getAllApps()
    this.setState({ gridApps })
  }

  renderLinks(links, name) {
    const { classes } = this.props

    if (!links) {
      return null
    }

    const renderList = links.map(link => (
      <a href={link.url} className={classes.link} key={link.name}>
        <Typography variant="body1">{link.name}</Typography>
      </a>
    ))

    return (
      <div>
        <Typography variant="body1" className={classes.headerText}>
          {name}
        </Typography>
        {renderList}
      </div>
    )
  }

  renderApps() {
    const { plugin, classes, pluginState } = this.props
    const { gridApps } = this.state
    const { apps } = plugin.about

    if (!apps || !gridApps) {
      return null
    }
    const renderList = (
      <Grid container spacing={16} style={{ marginTop: 0 }}>
        {apps.map(app => {
          const gridApp = gridApps.find(thisApp => thisApp.url === app.url)
          if (gridApp) {
            // Overwrite `dependencies` key with one specified in plugin so
            // plugin can have priority in launching with its own settings.
            const finalApp = { ...gridApp }
            if (app.dependencies) {
              finalApp.dependencies = app.dependencies
            }
            let badge = 0
            if (pluginState[plugin.name].appBadges[gridApp.id]) {
              badge = pluginState[plugin.name].appBadges[gridApp.id]
            }
            return (
              <Grid item xs={4} key={gridApp.name}>
                <AppItem app={finalApp} badge={badge} />
              </Grid>
            )
          }
          return null
        })}
      </Grid>
    )

    return (
      <div>
        <Typography
          variant="body1"
          className={classes.headerText}
          style={{ marginTop: 30 }}
        >
          Apps
        </Typography>
        {renderList}
      </div>
    )
  }

  render() {
    const { plugin, classes } = this.props
    const { about } = plugin

    if (!about) return <p>Plugin has no about data.</p>

    const { description, links, community, docs } = about
    return (
      <div>
        {description && (
          <div>
            <div>
              <Typography
                variant="body1"
                className={classes.headerText}
                style={{ marginTop: 30 }}
              >
                Description
              </Typography>
            </div>
            <div>
              <Typography variant="body1">{description}</Typography>
            </div>
          </div>
        )}
        <Grid container spacing={24} style={{ marginTop: 30 }}>
          <Grid item xs={4}>
            {this.renderLinks(links, 'Links')}
          </Grid>
          <Grid item xs={4}>
            {this.renderLinks(docs, 'Documentation')}
          </Grid>
          <Grid item xs={4}>
            {this.renderLinks(community, 'Community')}
          </Grid>
        </Grid>
        {this.renderApps()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    pluginState: state.plugin
  }
}

export default connect(mapStateToProps)(withStyles(styles)(AboutPlugin))
