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
    padding: theme.spacing.unit * 3
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
    active: PropTypes.string,
    classes: PropTypes.object,
    setActive: PropTypes.func,
    services: PropTypes.array,
    children: PropTypes.node,
    serviceVersion: PropTypes.func,
    handleToggle: PropTypes.func,
    isChecked: PropTypes.func,
    isDisabled: PropTypes.func
  }

  static defaultProps = {}

  render() {
    const {
      active,
      services,
      classes,
      children,
      setActive,
      serviceVersion,
      handleToggle,
      isChecked,
      isDisabled
    } = this.props

    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.toolbar} />
          <List>
            {services.map(service => (
              <ListItem
                key={service.name}
                disabled={service.disabled}
                selected={service.name === active}
                onClick={() => setActive(service.name)}
                classes={{
                  root: classes.hoverableListItem,
                  selected: classes.selected
                }}
                button
              >
                <ListItemText
                  primary={service.name}
                  secondary={serviceVersion(service)}
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
                  <Switch
                    color="primary"
                    onChange={() => handleToggle(service)}
                    checked={isChecked(service)}
                    disabled={isDisabled(service)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ServicesTab))
