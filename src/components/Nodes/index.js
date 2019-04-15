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

  serviceVersion = serviceName => {
    const { release } = this.props
    switch (serviceName) {
      case 'geth':
        if (release) {
          return release.version
        }
        return false
      default:
        return false
    }
  }

  handleSelect = client => {
    this.setState({ selectedClient: client })
  }

  // turn client on/off here
  handleToggle = async () => {
    const { selectedClient } = this.state
    const { isRunning } = selectedClient
    const { release } = this.props

    if (isRunning) {
      selectedClient.stop()
    } else {
      try {
        console.log('∆∆∆ start release.version', release.version)
        selectedClient.start(release)
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

    return (
      <ServicesNav
        active={active}
        setActive={service => this.setState({ active: service })}
        isChecked={this.isChecked}
        isDisabled={this.isDisabled}
        handleToggle={this.handleToggle}
        handleSelect={this.handleSelect}
        selectedClientName={selectedClient && selectedClient.name}
        selectedRelease={selectedRelease}
        tooltipText={this.tooltipText}
        serviceVersion={this.serviceVersion}
        clients={clients}
      >
        {selectedClient && (
          <ClientConfig
            client={selectedClient}
            selectedRelease={selectedRelease}
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
