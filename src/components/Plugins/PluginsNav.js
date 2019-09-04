import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import PluginsNavListItem from './PluginsNavListItem'

const drawerWidth = 240

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    top: 'auto'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100%',
    maxWidth: `calc(100% - ${drawerWidth}px)`,
    flexGrow: 1,
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
    // marginLeft: -drawerWidth
  },
  toolbar: theme.mixins.toolbar,
  listSubheader: {
    textTransform: 'uppercase',
    fontSize: '80%',
    height: '40px'
  }
})

class PluginsNav extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    plugins: PropTypes.array.isRequired,
    pluginState: PropTypes.object.isRequired,
    children: PropTypes.node,
    handleToggle: PropTypes.func.isRequired,
    handleSelectPlugin: PropTypes.func.isRequired,
    selectedPluginName: PropTypes.string
  }

  isDisabled = plugin => {
    const { pluginState } = this.props
    return !pluginState[plugin.name].release.version
  }

  isRunning = plugin => {
    const { pluginState } = this.props
    return ['STARTING', 'STARTED', 'CONNECTED'].includes(
      pluginState[plugin.name].active.status
    )
  }

  buildListItem = plugin => {
    const {
      classes,
      pluginState,
      handleToggle,
      handleSelectPlugin,
      selectedPluginName
    } = this.props

    const {
      content,
      drawer,
      drawerPaper,
      toolbar,
      listSubheader,
      ...restClasses
    } = classes

    return (
      <PluginsNavListItem
        key={plugin.name}
        plugin={plugin}
        classes={restClasses}
        handleToggle={handleToggle}
        handleSelectPlugin={handleSelectPlugin}
        isRunning={this.isRunning(plugin)}
        isDisabled={this.isDisabled(plugin)}
        isSelected={plugin.name === selectedPluginName}
        secondaryText={pluginState[plugin.name].release.version || ''}
      />
    )
  }

  renderLists = () => {
    const { plugins, classes } = this.props
    const types = [...new Set(plugins.map(plugin => plugin.type))]
    const buildList = type => (
      <List
        key={type}
        subheader={
          <ListSubheader classes={{ root: classes.listSubheader }}>
            {type}
          </ListSubheader>
        }
      >
        {this.renderPlugins(type)}
      </List>
    )
    const render = types.map(type => buildList(type))
    return render
  }

  renderPlugins = type => {
    const { plugins } = this.props
    const renderPlugins = plugins
      .filter(plugin => plugin.type === type)
      .sort((a, b) => a.order - b.order)
      .map(s => this.buildListItem(s))
    return renderPlugins
  }

  render() {
    const { classes, children } = this.props
    const showDrawer = true
    return (
      <React.Fragment>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          open={showDrawer}
          classes={{ paper: classes.drawerPaper }}
        >
          {this.renderLists()}
        </Drawer>
        <main className={classes.content}>{children}</main>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    pluginState: state.plugin,
    selectedPluginName: state.plugin.selected
  }
}

export default connect(mapStateToProps)(withStyles(styles)(PluginsNav))
