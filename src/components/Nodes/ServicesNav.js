import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ServicesNavListItem from './ServicesNavListItem'

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
  toolbar: theme.mixins.toolbar
})

class ServicesTab extends Component {
  static propTypes = {
    classes: PropTypes.object,
    clients: PropTypes.array,
    clientState: PropTypes.object,
    children: PropTypes.node,
    handleToggle: PropTypes.func,
    handleSelectClient: PropTypes.func,
    selectedClientName: PropTypes.string
  }

  isDisabled = client => {
    const { clientState } = this.props
    return !clientState[client.name].release.version
  }

  isRunning = client => {
    const { clientState } = this.props
    return ['STARTING', 'STARTED', 'CONNECTED'].includes(
      clientState[client.name].active.status
    )
  }

  buildListItem = client => {
    const {
      classes,
      clientState,
      handleToggle,
      handleSelectClient,
      selectedClientName
    } = this.props

    return (
      <ServicesNavListItem
        key={client.name}
        client={client}
        classes={classes}
        handleToggle={handleToggle}
        handleSelectClient={handleSelectClient}
        isRunning={this.isRunning(client)}
        isDisabled={this.isDisabled(client)}
        isSelected={client.name === selectedClientName}
        secondaryText={clientState[client.name].release.version || ''}
      />
    )
  }

  renderServiceListItems = () => {
    const { clients } = this.props
    const servicesSorted = clients.sort((a, b) => a.order - b.order)

    // Build client list items
    const clientsSorted = servicesSorted.filter(s => s.type === 'client')
    const clientListItems = clientsSorted.map(c => this.buildListItem(c))

    // Build other service list items
    const otherServices = servicesSorted.filter(s => s.type !== 'client')
    const serviceListItems = otherServices.map(s => this.buildListItem(s))

    return (
      <React.Fragment>
        {clientListItems}
        {serviceListItems}
      </React.Fragment>
    )
  }

  render() {
    const { classes, children } = this.props

    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.toolbar} />
          <List>{this.renderServiceListItems()}</List>
        </Drawer>
        <main className={classes.content}>{children}</main>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    clientState: state.client,
    selectedClientName: state.client.selected
  }
}

export default connect(mapStateToProps)(withStyles(styles)(ServicesTab))
