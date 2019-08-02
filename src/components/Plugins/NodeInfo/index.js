import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import classNames from 'classnames'
import { connect } from 'react-redux'
import moment from 'moment'

import NodeInfoDot from './NodeInfoDot'
import NodeInfoBox from './NodeInfoBox'

class NodeInfo extends Component {
  static displayName = 'NodeInfo'

  static propTypes = {
    clientState: PropTypes.object,
    selectedClient: PropTypes.string
  }

  state = {
    showSubmenu: false,
    diffTimestamp: moment().unix()
  }

  componentDidMount() {
    // diffTimestamp used to calculate time since last block
    this.diffInterval = setInterval(() => {
      this.setState({ diffTimestamp: moment().unix() })
    }, 1000)
  }

  render() {
    const { clientState, selectedClient } = this.props
    const client = clientState[selectedClient]
    if (!client) return null

    const { diffTimestamp, showSubmenu, sticky } = this.state
    const { network } = client

    const nodeInfoClass = classNames({
      'node-mainnet': network === 'main',
      'node-testnet': network !== 'main',
      sticky
    })

    return (
      <StyledNode>
        <div
          id="node-info"
          className={nodeInfoClass}
          onMouseUp={() => this.setState({ sticky: !sticky })}
          onMouseEnter={() => this.setState({ showSubmenu: true })}
          onMouseLeave={() => this.setState({ showSubmenu: sticky })}
          role="button"
          tabIndex={0}
        >
          <NodeInfoDot
            client={client}
            diffTimestamp={diffTimestamp}
            isStopped={client.active.status === 'STOPPED'}
            sticky={sticky}
          />
          {showSubmenu && (
            <NodeInfoBox diffTimestamp={diffTimestamp} client={client} />
          )}
        </div>
      </StyledNode>
    )
  }
}

function mapStateToProps(state) {
  return {
    clientState: state.plugin,
    selectedClient: state.plugin.selected
  }
}

export default connect(mapStateToProps)(NodeInfo)

const StyledNode = styled.div`
  cursor: default;
  display: inline-block;
  font-size: 0.9em;
  color: #827a7a;

  #node-info {
    margin: 0 5px;
    -webkit-app-region: no-drag;

    &:focus {
      outline: 0;
    }
  }
`
