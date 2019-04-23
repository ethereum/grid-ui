import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ClientConfig from './ClientConfig'
import ServicesNav from './ServicesNav'
import {
  initClient,
  selectClient,
  setConfig,
  toggleClient
} from '../../store/client/actions'

import Grid from '../../API/Grid'

const { PluginHost } = Grid

class NodesTab extends Component {
  static propTypes = {
    config: PropTypes.object,
    dispatch: PropTypes.func,
    release: PropTypes.object
  }

  state = {
    clients: [],
    selectedClient: undefined
  }

  componentDidMount() {
    if (!PluginHost) return
    this.initClients()
  }

  initClients = () => {
    const { dispatch } = this.props

    const plugins = PluginHost.getAllPlugins()

    // Sync clients with redux
    const clients = [...plugins].filter(plugin => plugin.type === 'client')
    clients.map(client => dispatch(initClient(client.plugin.config)))

    // Set the selected client
    const selectedClient =
      clients.find(client => client.order === 1) || clients[0]
    this.handleSelectClient(selectedClient)

    // TODO: two sources of truth - local and redux state
    this.setState({ clients })
  }

  isDisabled = client => {
    const { selectedRelease } = client
    return !selectedRelease
  }

  handleSelectClient = client => {
    const { dispatch } = this.props

    this.setState({ selectedClient: client }, () => {
      dispatch(selectClient(client.name))
    })
  }

  handleClientConfigChanged = (key, value) => {
    const { config, dispatch } = this.props
    const { selectedClient } = this.state

    // we need to store the config per client
    // for now we just use a nested data model where the selected client
    // has a property with the latest user selected config
    // WARNING: if selected client is destructured
    /**
     * newSelectedClient = {
     *  ...selectedClient
     * }
     * the reference to the remote object in main is killed in this process
     */

    const newConfig = { ...config }
    newConfig[key] = value

    selectedClient.selectedConfig = newConfig
    this.setState({ selectedClient }, () => {
      dispatch(setConfig(newConfig))
    })
  }

  handleReleaseSelect = release => {
    const { selectedClient } = this.state
    selectedClient.selectedRelease = release
    this.setState({ selectedClient, selectedRelease: release })
  }

  handleToggle = async () => {
    const { dispatch, release, config } = this.props
    const { selectedClient } = this.state
    dispatch(toggleClient(selectedClient, release, config))
  }

  render() {
    const { clients, selectedClient, selectedRelease } = this.state

    return (
      <ServicesNav
        handleToggle={this.handleToggle}
        handleSelectClient={this.handleSelectClient}
        clients={clients}
      >
        {selectedClient && (
          <ClientConfig
            client={selectedClient}
            selectedRelease={selectedRelease}
            handleClientConfigChanged={this.handleClientConfigChanged}
            handleReleaseSelect={this.handleReleaseSelect}
          />
        )}
      </ServicesNav>
    )
  }
}

function mapStateToProps(state) {
  return {
    config: state.client.config,
    release: state.client.release
  }
}

export default connect(mapStateToProps)(NodesTab)
