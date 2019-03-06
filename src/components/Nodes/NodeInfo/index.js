import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import NodeInfoDot from './NodeInfoDot'
import NodeInfoBox from './NodeInfoBox'

export default class NodeInfo extends Component {
  static displayName = 'NodeInfo'

  static propTypes = {
    /** Active network */
    active: PropTypes.oneOf(['remote', 'local']).isRequired,
    /** Current network */
    network: PropTypes.oneOf(['main', 'rinkeby', 'kovan', 'private'])
      .isRequired,
    /** Local network data */
    local: PropTypes.shape({
      blockNumber: PropTypes.number,
      timestamp: PropTypes.number,
      sync: PropTypes.shape({
        highestBlock: PropTypes.number.isRequired,
        currentBlock: PropTypes.number.isRequired,
        startingBlock: PropTypes.number.isRequired
      }).isRequired
    }).isRequired,
    /** Remote network data */
    remote: PropTypes.shape({
      blockNumber: PropTypes.number,
      timestamp: PropTypes.number
    }).isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      showSubmenu: false
    }
  }

  render() {
    const { network, active, remote, local } = this.props
    const { showSubmenu, sticky } = this.state

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
            network={network}
            active={active}
            remote={remote}
            local={local}
            sticky={sticky}
          />

          {showSubmenu && (
            <NodeInfoBox
              network={network}
              active={active}
              remote={remote}
              local={local}
              dotLocation="topLeft"
            />
          )}
        </div>
      </StyledNode>
    )
  }
}

const StyledNode = styled.div`
  position: absolute;
  top: 2px;
  left: 55px;
  cursor: default;
  display: flex;
  flex-flow: row wrap;
  flex-shrink: 0;
  font-size: 0.9em;
  color: #827a7a;

  #node-info {
    padding: 5px;
    -webkit-app-region: no-drag;

    &:focus {
      outline: 0;
    }
  }
`
