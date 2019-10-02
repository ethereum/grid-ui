import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import FormItem from './FormItem'
import FlagPreview from './FlagPreview'
import { getGeneratedFlags, setFlags } from '../../../../store/plugin/actions'

class DynamicConfigForm extends Component {
  static propTypes = {
    settings: PropTypes.array,
    pluginState: PropTypes.object,
    plugin: PropTypes.object,
    isPluginRunning: PropTypes.bool,
    handlePluginConfigChanged: PropTypes.func,
    dispatch: PropTypes.func
  }

  constructor(props) {
    super(props)

    const { pluginState } = props
    const preloadPlugin = window.Grid.PluginHost.getPluginByName(
      pluginState.selected
    )
    const { config, flags } = pluginState[pluginState.selected]
    const generatedFlags = getGeneratedFlags(preloadPlugin, config)
    const isEditingFlags = !flags.every(f => generatedFlags.includes(f))
    this.state = { isEditingFlags }
  }

  toggleEditGeneratedFlags = checked => {
    const { pluginState, dispatch } = this.props
    const { config } = pluginState[pluginState.selected]
    const preloadPlugin = window.Grid.PluginHost.getPluginByName(
      pluginState.selected
    )
    this.setState({ isEditingFlags: checked })
    if (!checked) {
      dispatch(setFlags(preloadPlugin, config))
    }
  }

  wrapGridItem = (el, index) => {
    return (
      <Grid item xs={6} key={index}>
        {el}
      </Grid>
    )
  }

  wrapFormItem = item => {
    const { plugin, isPluginRunning, handlePluginConfigChanged } = this.props
    const { isEditingFlags } = this.state
    return (
      <FormItem
        key={item.id}
        itemKey={item.id}
        item={item}
        pluginName={plugin.name}
        isPluginRunning={isPluginRunning}
        handlePluginConfigChanged={handlePluginConfigChanged}
        isEditingFlags={isEditingFlags}
      />
    )
  }

  render() {
    const { settings, plugin, pluginState, isPluginRunning } = this.props
    const { isEditingFlags } = this.state
    const { config, flags } = pluginState[pluginState.selected]

    if (!settings) return <h4>No configuration settings found</h4>

    const formItems = settings
      .filter(setting => !setting.required) // Omit required flags from UI
      .map(this.wrapFormItem)
      .map(this.wrapGridItem)

    return (
      <div>
        <Grid
          container
          style={{ paddingTop: 15, paddingBottom: 15 }}
          spacing={24}
        >
          {formItems}
        </Grid>
        <hr style={{ opacity: 0.7 }} />
        <div style={{ marginTop: 30 }}>
          <FlagPreview
            flags={flags}
            config={config}
            plugin={plugin}
            isEditingFlags={isEditingFlags}
            toggleEditGeneratedFlags={this.toggleEditGeneratedFlags}
            isPluginRunning={isPluginRunning}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    pluginState: state.plugin
  }
}

export default connect(mapStateToProps)(DynamicConfigForm)
