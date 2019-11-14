import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PluginConfig from './PluginConfig'
import PluginsNav from './PluginsNav'
import {
  initPlugin,
  selectPlugin,
  setConfig,
  togglePlugin
} from '../../store/plugin/actions'
import {
  getPersistedPluginSelection,
  getPersistedTabSelection
} from '../../lib/utils'

import Grid from '../../API/Grid'

const { PluginHost } = Grid

class PluginsTab extends Component {
  static propTypes = {
    pluginState: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  state = {
    plugins: [],
    selectedPlugin: undefined
  }

  componentDidMount() {
    if (!PluginHost) return
    const plugins = PluginHost.getAllPlugins()
    this.initPlugins(plugins)
  }

  initPlugins = plugins => {
    const { pluginState, dispatch } = this.props

    // Sync plugins with Redux
    plugins.map(plugin => dispatch(initPlugin(plugin)))

    // Set the selected plugin from config.json or a fallback method
    const selectedPlugin =
      plugins.find(plugin => plugin.name === getPersistedPluginSelection()) ||
      plugins.find(plugin => plugin.name === pluginState.selected) ||
      plugins.find(plugin => plugin.order === 1) ||
      plugins[0]
    const selectedTab = getPersistedTabSelection()
    this.handleSelectPlugin(selectedPlugin, selectedTab)

    // TODO: two sources of truth - local and redux state
    this.setState({ plugins })
  }

  isDisabled = plugin => {
    const { selectedRelease } = plugin
    return !selectedRelease
  }

  handleSelectPlugin = (plugin, tab) => {
    const { dispatch } = this.props

    this.setState({ selectedPlugin: plugin }, () => {
      dispatch(selectPlugin(plugin.name, tab))
    })
  }

  handlePluginConfigChanged = (key, value) => {
    const { pluginState, dispatch } = this.props
    const { plugins } = this.state

    const activePlugin = plugins.filter(p => p.name === pluginState.selected)[0]

    const { config } = pluginState[pluginState.selected]
    const newConfig = { ...config }
    newConfig[key] = value

    dispatch(setConfig(activePlugin, newConfig))
  }

  handleReleaseSelect = release => {
    const { selectedPlugin } = this.state
    selectedPlugin.selectedRelease = release
    this.setState({ selectedPlugin, selectedRelease: release })
  }

  handleToggle = plugin => {
    const { pluginState, dispatch } = this.props
    // TODO: refactor to only require pluginName to toggle?
    dispatch(togglePlugin(plugin, pluginState[plugin.name].release))
  }

  render() {
    const { plugins, selectedPlugin, selectedRelease } = this.state

    return (
      <PluginsNav
        handleToggle={this.handleToggle}
        handleSelectPlugin={this.handleSelectPlugin}
        plugins={plugins}
      >
        {selectedPlugin && (
          <PluginConfig
            plugin={selectedPlugin}
            selectedRelease={selectedRelease}
            handlePluginConfigChanged={this.handlePluginConfigChanged}
            handleReleaseSelect={this.handleReleaseSelect}
          />
        )}
      </PluginsNav>
    )
  }
}

function mapStateToProps(state) {
  return {
    pluginState: state.plugin
  }
}

export default connect(mapStateToProps)(PluginsTab)
