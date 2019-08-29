import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import FormItem from './FormItem'
import FlagPreview from './FlagPreview'
import { setFlags, getGeneratedFlags } from '../../../../store/plugin/actions'

class DynamicConfigForm extends Component {
  static propTypes = {
    settings: PropTypes.array,
    pluginName: PropTypes.string,
    plugin: PropTypes.object,
    isPluginRunning: PropTypes.bool,
    handlePluginConfigChanged: PropTypes.func,
    dispatch: PropTypes.func
  }

  constructor(props) {
    super(props)

    const { plugin } = props
    const preloadPlugin = window.Grid.PluginHost.getPluginByName(
      plugin.selected
    )
    const { config, flags } = plugin[plugin.selected]
    const generatedFlags = getGeneratedFlags(preloadPlugin, config)
    const flagsIsCustom = !flags.every(f => generatedFlags.includes(f))
    this.state = {
      editGeneratedFlags: flagsIsCustom
    }
  }

  toggleEditGeneratedFlags = checked => {
    const { plugin, dispatch } = this.props
    const { config } = plugin[plugin.selected]
    const preloadPlugin = window.Grid.PluginHost.getPluginByName(
      plugin.selected
    )
    this.setState({ editGeneratedFlags: checked })
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
    const {
      plugin,
      pluginName,
      isPluginRunning,
      handlePluginConfigChanged
    } = this.props
    const { editGeneratedFlags } = this.state
    return (
      <FormItem
        key={item.id}
        itemKey={item.id}
        item={item}
        plugin={plugin}
        pluginName={pluginName}
        isPluginRunning={isPluginRunning}
        handlePluginConfigChanged={handlePluginConfigChanged}
        editGeneratedFlags={editGeneratedFlags}
      />
    )
  }

  render() {
    const { settings, plugin, isPluginRunning } = this.props
    const { editGeneratedFlags } = this.state
    const { flags } = plugin[plugin.selected]

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
        <hr />
        <div style={{ marginTop: 25 }}>
          <FlagPreview
            flags={flags}
            plugin={plugin}
            isEditingFlags={editGeneratedFlags}
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
    plugin: state.plugin
  }
}

export default connect(mapStateToProps)(DynamicConfigForm)
