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
    clientName: PropTypes.string,
    client: PropTypes.object,
    isClientRunning: PropTypes.bool,
    handleClientConfigChanged: PropTypes.func,
    dispatch: PropTypes.func
  }

  constructor(props) {
    super(props)

    const { client } = props
    const clientPlugin = window.Grid.PluginHost.getPluginByName(client.selected)
    const { config, flags } = client[client.selected]
    const generatedFlags = getGeneratedFlags(clientPlugin, config)
    const flagsIsCustom = !flags.every(f => generatedFlags.includes(f))
    this.state = {
      editGeneratedFlags: flagsIsCustom
    }
  }

  toggleEditGeneratedFlags = checked => {
    const { client, dispatch } = this.props
    const { config } = client[client.selected]
    const clientPlugin = window.Grid.PluginHost.getPluginByName(client.selected)
    this.setState({ editGeneratedFlags: checked })
    if (!checked) {
      dispatch(setFlags(clientPlugin, config))
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
      client,
      clientName,
      isClientRunning,
      handleClientConfigChanged
    } = this.props
    const { editGeneratedFlags } = this.state
    return (
      <FormItem
        key={item.id}
        itemKey={item.id}
        item={item}
        client={client}
        clientName={clientName}
        isClientRunning={isClientRunning}
        handleClientConfigChanged={handleClientConfigChanged}
        editGeneratedFlags={editGeneratedFlags}
      />
    )
  }

  render() {
    const { settings, client, isClientRunning } = this.props
    const { editGeneratedFlags } = this.state
    const { flags } = client[client.selected]

    if (!settings) return <h4>No configuration settings found</h4>

    const formItems = settings.map(this.wrapFormItem).map(this.wrapGridItem)

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
            client={client}
            isEditingFlags={editGeneratedFlags}
            toggleEditGeneratedFlags={this.toggleEditGeneratedFlags}
            isClientRunning={isClientRunning}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.plugin
  }
}

export default connect(mapStateToProps)(DynamicConfigForm)
