import React, { Component } from 'react'
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
    // active: PropTypes.string,
    classes: PropTypes.object,
    // setActive: PropTypes.func,
    clients: PropTypes.array,
    children: PropTypes.node,
    handleToggle: PropTypes.func,
    // isChecked: PropTypes.func,
    // isDisabled: PropTypes.func,
    // tooltipText: PropTypes.func
    handleSelect: PropTypes.func,
    selectedClientName: PropTypes.string,
    selectedClient: PropTypes.object
  }

  static defaultProps = {}

  render() {
    const {
      classes,
      handleToggle,
      handleSelect,
      selectedClientName,
      selectedClient,
      children,
      clients
    } = this.props

    const { selectedRelease } = selectedClient || {}
    const { version } = selectedRelease || {}

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
                    secondary={
                      client.name === selectedClientName ? version : ''
                    }
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
                    <Tooltip title={client.tooltipText || ''} placement="left">
                      <span />
                    </Tooltip>
                    <span>
                      <Switch
                        color="primary"
                        onChange={() => handleToggle(client)}
                        checked={client.running}
                        disabled={!selectedRelease}
                      />
                    </span>
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

export default withStyles(styles)(ServicesTab)
