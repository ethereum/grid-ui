import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Tooltip from '@material-ui/core/Tooltip'

const drawerWidth = 240

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: `${theme.spacing.unit * 9}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  toolbar: theme.mixins.toolbar,
  selected: {
    '&$selected': {
      backgroundColor: '#ffffff',
      '&:hover': {
        backgroundColor: '#ffffff'
      }
    }
  },
  serviceName: {
    marginRight: 5,
    textTransform: 'capitalize'
  },
  hoverableListItem: {
    '&:hover $versionInfo': {
      visibility: 'visible'
    }
  },
  versionInfo: {
    fontSize: '80%',
    visibility: 'hidden'
  }
})

class ServicesTab extends Component {
  static propTypes = {
    activeClientName: PropTypes.string,
    activeClientVersion: PropTypes.string,
    classes: PropTypes.object,
    clients: PropTypes.array,
    children: PropTypes.node,
    handleToggle: PropTypes.func,
    handleSelect: PropTypes.func,
    selectedClientName: PropTypes.string,
    releaseName: PropTypes.string,
    releaseVersion: PropTypes.string
  }

  isDisabled = client => {
    const { activeClientName, releaseName, releaseVersion } = this.props

    // TODO:
    // for now, can only toggle selected client.
    // Redux only storing selectedClient data.

    // 0) if active, always allow toggling
    // if (client.name === activeClientName) return false
    // console.log(activeClientName, client.name, releaseName, releaseVersion)

    return (
      // 1) no release selected
      !releaseVersion //||
      // 2) wrong client selected
      // client.name !== releaseName.split('-')[0].toLowerCase() ||
      // 3) there is already a client running
      // FIXME wrong for raiden + geth : (activeClientName && client.name !== activeClientName)
    )
  }

  parseTooltipText = (/* client */) => {
    // TODO:
    return ''
  }

  parseSecondaryText = client => {
    const {
      activeClientName,
      activeClientVersion,
      releaseVersion,
      selectedClientName
    } = this.props

    if (client.name === selectedClientName) {
      return releaseVersion || ''
    }

    if (client.name === activeClientName) {
      return activeClientVersion || ''
    }

    return ''
  }

  render() {
    const {
      classes,
      handleToggle,
      handleSelect,
      selectedClientName,
      children,
      clients
    } = this.props

    const clientsSorted = clients.sort((a, b) => a.order - b.order)

    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.toolbar} />
          <List>
            {clientsSorted.map(client => {
              return (
                <ListItem
                  key={client.name}
                  selected={client.name === selectedClientName}
                  onClick={() => handleSelect(client)}
                  classes={{
                    root: classes.hoverableListItem,
                    selected: classes.selected
                  }}
                  button
                >
                  <ListItemText
                    primary={client.displayName}
                    secondary={this.parseSecondaryText(client)}
                    primaryTypographyProps={{
                      inline: true,
                      classes: { root: classes.serviceName }
                    }}
                    secondaryTypographyProps={{
                      inline: true,
                      classes: { root: classes.versionInfo }
                    }}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip
                      title={this.parseTooltipText(client)}
                      placement="left"
                    >
                      <span>
                        <Switch
                          color="primary"
                          onChange={() => handleToggle(client)}
                          checked={client.running}
                          disabled={this.isDisabled(client)}
                        />
                      </span>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              )
            })}
          </List>
        </Drawer>
        <main className={classes.content}>{children}</main>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    releaseName: state.client.release.name,
    releaseVersion: state.client.release.version,
    activeClientName: state.client.active.name,
    activeClientVersion: state.client.active.version,
    selectedClientName: state.client.name
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ServicesTab))
