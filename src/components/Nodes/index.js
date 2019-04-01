import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import GethConfig from './GethConfig'
import { initGeth, toggleGeth } from '../../store/client/actions'
import Geth from '../../store/client/gethService'
import ServicesNav from './ServicesNav'

class NodesTab extends Component {
  static propTypes = {
    client: PropTypes.object,
    dispatch: PropTypes.func
  }

  static defaultProps = {}

  state = {
    active: 'geth',
    services: [
      { name: 'geth' }
      // { name: 'remix' }
    ]
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(initGeth())
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

  handleToggle = service => {
    const { dispatch } = this.props
    switch (service.name) {
      case 'geth':
        dispatch(toggleGeth())
        break
      default:
        break
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
    const { active, services } = this.state

    return (
      <ServicesNav
        active={active}
        setActive={service => this.setState({ active: service })}
        isChecked={this.isChecked}
        isDisabled={this.isDisabled}
        handleToggle={this.handleToggle}
        tooltipText={this.tooltipText}
        serviceVersion={this.serviceVersion}
        services={services}
      >
        {active === 'geth' && <GethConfig />}
        {/* active === 'remix' && <div>Remix</div> */}
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
