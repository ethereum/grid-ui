import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import { Mist } from '../../API'
import GethConfig from './GethConfig'

const { geth } = Mist
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
  toolbar: theme.mixins.toolbar
})

class NodesTab extends Component {
  static propTypes = {
    classes: PropTypes.object
  }

  static defaultProps = {}

  static isChecked(name) {
    if (name === 'Geth') {
      const { isRunning } = geth
      return isRunning
    }
    return false
  }

  state = {
    activeItem: 'Geth',
    nodes: [{ name: 'Geth' }]
  }

  constructor(props) {
    super(props)
    this.gethConfigRef = React.createRef()
  }

  handleNodeSelect = name => {
    this.setState({ activeItem: name })
  }

  handleToggle = name => {
    if (name === 'Geth') {
      this.gethConfigRef.current.handleStartStop()
    }
  }

  isDisabled(name) {
    if (name === 'Geth') {
      if (
        !this.gethConfigRef ||
        !this.gethConfigRef.current ||
        !this.gethConfigRef.current.versionListRef ||
        !this.gethConfigRef.current.versionListRef.state ||
        !this.gethConfigRef.current.versionListRef.state.selectedRelease
      ) {
        return true
      }
    }
    return false
  }

  render() {
    const { classes } = this.props
    const { activeItem, nodes } = this.state

    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.toolbar} />
          <List>
            {nodes.map(node => (
              <ListItem
                key={node.name}
                disabled={node.disabled}
                selected={node.name === activeItem}
                onClick={() => this.handleNodeSelect(node.name)}
                button
              >
                <ListItemText primary={node.name} />
                <ListItemSecondaryAction>
                  <Switch
                    color="primary"
                    onChange={() => this.handleToggle(node.name)}
                    checked={NodesTab.isChecked(node.name)}
                    disabled={this.isDisabled(node.name)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {activeItem === 'Geth' && <GethConfig ref={this.gethConfigRef} />}
        </main>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NodesTab)
