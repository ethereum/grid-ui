import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import GethConfig from './containers/Network/GethConfig'

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
  static displayName = 'NodesTab'

  static propTypes = {
    classes: PropTypes.object
  }

  static defaultProps = {}

  state = {
    activeItem: 'Geth',
    nodes: [{ name: 'Geth', on: false, disabled: false }]
  }

  handleNodeSelect = name => {
    this.setState({ activeItem: name })
  }

  handleToggle = (name, on) => {
    const { nodes } = this.state
    const newNodes = nodes.map(node => {
      if (node.name === name) {
        return { ...node, on: !on }
      }
      return node
    })
    this.setState({ nodes: newNodes })
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
                    onChange={() => this.handleToggle(node.name, node.on)}
                    checked={node.on}
                    disabled={node.disabled}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Typography variant="h5">{activeItem}</Typography>
          {activeItem === 'Geth' && <GethConfig />}
        </main>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(NodesTab)
