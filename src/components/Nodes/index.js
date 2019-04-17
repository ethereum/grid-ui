import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ClientConfig from './ClientConfig'
import Geth from '../../store/client/gethService'
import ServicesNav from './ServicesNav'
import { selectClient, toggleClient } from '../../store/client/actions'

import Grid from '../../API/Grid'

const { PluginHost } = Grid

class NodesTab extends Component {
  static propTypes = {
    clientStatus: PropTypes.string,
    dispatch: PropTypes.func,
    release: PropTypes.object
  }

  static defaultProps = {}

  state = {
    clients: [],
    selectedClient: undefined
  }

  componentDidMount() {
    if (!PluginHost) return
    const plugins = PluginHost.getAllPlugins()
    const clients = [...plugins]
    const selectedClient = clients[0]
    this.setState({ clients, selectedClient })
  }

  isChecked = service => {
    const { clientStatus } = this.props
    switch (service.name) {
      case 'geth':
        return Geth.isRunning(clientStatus)
      default:
        return false
    }
  }

  isDisabled = client => {
    const { selectedRelease } = client
    return !selectedRelease
  }

  handleSelect = client => {
    const { dispatch } = this.props
    console.log('handle select', client)
    dispatch(selectClient(client.plugin.config))
    this.setState({ selectedClient: client })
  }

  handleClientConfigChanged = config => {
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
    selectedClient.selectedConfig = config
    this.setState({ selectedClient })
  }

  handleReleaseSelect = release => {
    const { selectedClient } = this.state
    selectedClient.selectedRelease = release
    this.setState({ selectedClient, selectedRelease: release })
  }

  handleToggle = async () => {
    const { dispatch, release } = this.props
    const { selectedClient } = this.state
    const { selectedConfig } = selectedClient

    dispatch(toggleClient(selectedClient, release, selectedConfig))
  }

  tooltipText = service => {
    switch (service.name) {
      case 'geth':
        if (this.isDisabled(service)) {
          return 'Please select a version first'
        }
        return ''
      default:
        return ''
    }
  }

  render() {
    const { active, clients, selectedClient, selectedRelease } = this.state

    return (
      <ServicesNav
        active={active}
        setActive={service => this.setState({ active: service })}
        isChecked={this.isChecked}
        handleToggle={this.handleToggle}
        handleSelect={this.handleSelect}
        selectedClientName={selectedClient && selectedClient.name}
        selectedClient={selectedClient}
        selectedRelease={selectedRelease}
        tooltipText={this.tooltipText}
        clients={clients}
      >
        {selectedClient && (
          <ClientConfig
            client={selectedClient}
            selectedRelease={selectedRelease}
            clientConfigChanged={this.handleClientConfigChanged}
            handleReleaseSelect={this.handleReleaseSelect}
          />
        )}
      </ServicesNav>
    )
  }
}

function mapStateToProps(state) {
  return {
    release: state.client.release,
    clientStatus: state.client.active.status
  }
}

export default connect(mapStateToProps)(NodesTab)
