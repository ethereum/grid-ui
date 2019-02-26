import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import styled from 'styled-components'
import NodeSetup from './containers/Network/NodeSetup'

export default class GethSettings extends Component {
  static displayName = 'GethSettings'

  static propTypes = {}

  static defaultProps = {}

  render() {
    return <NodeSetup />
  }
}
