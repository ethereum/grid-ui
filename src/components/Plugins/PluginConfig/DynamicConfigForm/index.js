import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import Button from '../../../shared/Button'
import FormItem from './FormItem'
import FlagPreview from './FlagPreview'
import {
  getGeneratedFlags,
  restoreDefaultSettings,
  setFlags
} from '../../../../store/plugin/actions'

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
    const flagsIsCustom = !flags.every(f => generatedFlags.includes(f))
    this.state = {
      editGeneratedFlags: flagsIsCustom
    }
  }

  toggleEditGeneratedFlags = checked => {
    const { pluginState, dispatch } = this.props
    const { config } = pluginState[pluginState.selected]
    const preloadPlugin = window.Grid.PluginHost.getPluginByName(
      pluginState.selected
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
      pluginState,
      plugin,
      isPluginRunning,
      handlePluginConfigChanged
    } = this.props
    const { editGeneratedFlags } = this.state
    return (
      <FormItem
        key={item.id}
        itemKey={item.id}
        item={item}
        plugin={pluginState}
        pluginName={plugin.name}
        isPluginRunning={isPluginRunning}
        handlePluginConfigChanged={handlePluginConfigChanged}
        editGeneratedFlags={editGeneratedFlags}
      />
    )
  }

  handleRestoreDefaultSettings = () => {
    const { dispatch, plugin } = this.props
    dispatch(restoreDefaultSettings(plugin))
  }

  render() {
    const { settings, pluginState, isPluginRunning } = this.props
    const { editGeneratedFlags } = this.state
    const { flags } = pluginState[pluginState.selected]

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
            plugin={pluginState}
            isEditingFlags={editGeneratedFlags}
            toggleEditGeneratedFlags={this.toggleEditGeneratedFlags}
            isPluginRunning={isPluginRunning}
          />
        </div>
        <Button
          style={{ float: 'right' }}
          onClick={this.handleRestoreDefaultSettings}
        >
          Restore Defaults
        </Button>
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
