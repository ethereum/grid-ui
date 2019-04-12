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
    client: PropTypes.object
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
    const { client } = this.props
    const { state } = client
    switch (service.name) {
      case 'geth':
        return Geth.isRunning(state)
      default:
        return false
    }
  }

  isDisabled = client => {
    const { selectedRelease } = client
    return !selectedRelease
  }

  serviceVersion = service => {
    const { client } = this.props
    const { release } = client
    switch (service.name) {
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

  handleSelectRelease = release => {
    const { selectedClient } = this.state
    selectedClient.selectedRelease = release
    this.setState({
      selectedClient
    })
  }

  // turn client on/off here
  handleToggle = async () => {
    const { selectedClient } = this.state
    const { selectedRelease } = selectedClient
    const { isRunning } = selectedClient
    console.log('handle toggle', isRunning)
    if (isRunning) {
      selectedClient.stop()
    } else {
      try {
        console.log('start release', selectedRelease)
        selectedClient.start(selectedRelease /* config */)
      } catch (error) {
        console.log('could not start', error)
      }
    }
    /*
    const { dispatch } = this.props
    switch (service.name) {
      case 'geth':
        // dispatch(toggleGeth())
        break
      default:
        break
    }
    */
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
    console.log('selected', selectedClient)
    return (
      <ServicesNav
        active={active}
        setActive={service => this.setState({ active: service })}
        isChecked={this.isChecked}
        isDisabled={this.isDisabled}
        handleToggle={this.handleToggle}
        handleSelect={this.handleSelect}
        selectedClient={selectedClient}
        selectedRelease={selectedRelease}
        tooltipText={this.tooltipText}
        serviceVersion={this.serviceVersion}
        clients={clients}
      >
        {selectedClient && (
          <ClientConfig
            client={selectedClient}
            handleSelectRelease={this.handleSelectRelease}
            selectedRelease={selectedRelease}
          />
        )}
      </ServicesNav>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(NodesTab)
