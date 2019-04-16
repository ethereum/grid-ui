import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ClientConfig from './ClientConfig'
// import { initGeth, toggleGeth } from '../../store/client/actions'
import Geth from '../../store/client/gethService'
import ServicesNav from './ServicesNav'

import Grid from '../../API/Grid'

const { PluginHost } = Grid

class NodesTab extends Component {
  static propTypes = {
    clientStatus: PropTypes.string,
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
    console.log('handle select', client)
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
    this.setState({
      selectedClient
    })
  }

  handleSelectedReleaseChanged = release => {
    console.log('handle selected release changed', release)
    const { selectedClient } = this.state
    selectedClient.selectedRelease = release
    this.setState({
      selectedClient,
      selectedRelease: release
    })
  }

  // turn client on/off here
  handleToggle = async () => {
    const { selectedClient } = this.state
    const { isRunning } = selectedClient
    const { release } = this.props
    const { selectedConfig } = selectedClient

    if (isRunning) {
      selectedClient.stop()
    } else {
      try {
        console.log(
          '∆∆∆ start release.version',
          release.version,
          selectedConfig
        )
        selectedClient.start(release, selectedConfig)
      } catch (error) {
        console.log('could not start', error)
      }
    }
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

    console.log('selected release', selectedRelease)

    return (
      <ServicesNav
        active={active}
        setActive={service => this.setState({ active: service })}
        isChecked={this.isChecked}
        isDisabled={this.isDisabled}
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
            selectedReleaseChanged={this.handleSelectedReleaseChanged}
          />
        )}
      </ServicesNav>
    )
  }
}

function mapStateToProps(state) {
  return {
    release: state.client.release,
    clientStatus: state.client.state
  }
}

export default connect(mapStateToProps)(NodesTab)
