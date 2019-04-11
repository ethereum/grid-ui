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
    client: PropTypes.object,
    dispatch: PropTypes.func
  }

  static defaultProps = {}

  state = {
    clients: [],
    selectedClient: undefined,
    selectedRelease: undefined
  }

  componentDidMount() {
    // const { dispatch } = this.props

    if (!PluginHost) return
    const plugins = PluginHost.getAllPlugins()
    const clients = [...plugins]
    const selectedClient = clients[0]
    this.setState({ clients, selectedClient })

    // dispatch(initGeth())
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

  isDisabled = service => {
    const { client } = this.props
    const { release } = client
    switch (service.name) {
      case 'geth':
        return !release
      default:
        return true
    }
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
    this.setState({
      selectedClient: client
    })
  }

  handleSelectRelease = release => {
    this.setState({
      selectedRelease: release
    })
  }

  // turn client on/off here
  handleToggle = async client => {
    const { selectedClient, selectedRelease } = this.state
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
    const { active, clients, selectedClient } = this.state
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
        tooltipText={this.tooltipText}
        serviceVersion={this.serviceVersion}
        services={clients}
      >
        {selectedClient && (
          <ClientConfig
            client={selectedClient}
            handleSelectRelease={this.handleSelectRelease}
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
