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
import GethConfig from './GethConfig'
import { initGeth, toggleGeth } from '../../store/client/actions'
import Geth from '../../store/client/gethService'

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
  nodeName: {
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

class NodesTab extends Component {
  static propTypes = {
    classes: PropTypes.object,
    client: PropTypes.object,
    dispatch: PropTypes.func
  }

  static defaultProps = {}

  state = {
    active: 'geth',
    nodes: [{ name: 'geth' }]
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(initGeth())
  }

  handleSelectNode = node => {
    this.setState({ active: node.name })
  }

  isChecked = node => {
    const { client } = this.props
    const { state } = client
    switch (node.name) {
      case 'geth':
        return Geth.isRunning(state)
      default:
        return false
    }
  }

  isDisabled = node => {
    const { client } = this.props
    const { release } = client
    switch (node.name) {
      case 'geth':
        return !release
      default:
        return true
    }
  }

  nodeVersion = node => {
    const { client } = this.props
    const { release } = client
    switch (node.name) {
      case 'geth':
        if (release) {
          return release.version
        }
        return false
      default:
        return false
    }
  }

  handleToggle = node => {
    const { dispatch } = this.props
    switch (node.name) {
      case 'geth':
        dispatch(toggleGeth())
        break
      default:
        break
    }
  }

  render() {
    const { classes } = this.props
    const { active, nodes } = this.state

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
                selected={node.name === active}
                onClick={() => this.handleSelectNode(node)}
                classes={{
                  root: classes.hoverableListItem,
                  selected: classes.selected
                }}
                button
              >
                <ListItemText
                  primary={node.name}
                  secondary={this.nodeVersion(node)}
                  primaryTypographyProps={{
                    inline: true,
                    classes: { root: classes.nodeName }
                  }}
                  secondaryTypographyProps={{
                    inline: true,
                    classes: { root: classes.versionInfo }
                  }}
                />
                <ListItemSecondaryAction>
                  <Switch
                    color="primary"
                    onChange={() => this.handleToggle(node)}
                    checked={this.isChecked(node)}
                    disabled={this.isDisabled(node)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          {active === 'geth' && <GethConfig />}
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

export default connect(mapStateToProps)(withStyles(styles)(NodesTab))
