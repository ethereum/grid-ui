import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ClientConfig from './ClientConfig'
import ServicesNav from './ServicesNav'
import { selectClient, toggleClient } from '../../store/client/actions'

import Grid from '../../API/Grid'

const { PluginHost } = Grid

class NodesTab extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    release: PropTypes.object
  }

  static defaultProps = {}

  state = {
    clients: [],
    selectedClient: undefined
  }

  componentDidMount() {
    const { dispatch } = this.props
    if (!PluginHost) return
    const plugins = PluginHost.getAllPlugins()
    const clients = [...plugins]
    const selectedClient = clients[0]
    dispatch(selectClient(selectedClient.plugin.config))
    this.setState({ clients, selectedClient })
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

  render() {
    const { active, clients, selectedClient, selectedRelease } = this.state

    return (
      <ServicesNav
        active={active}
        setActive={service => this.setState({ active: service })}
        handleToggle={this.handleToggle}
        handleSelect={this.handleSelect}
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
    release: state.client.release
  }
}

export default connect(mapStateToProps)(NodesTab)
