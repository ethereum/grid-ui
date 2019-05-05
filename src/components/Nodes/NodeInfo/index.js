import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import classNames from 'classnames'
import { connect } from 'react-redux'

import NodeInfoDot from './NodeInfoDot'
import NodeInfoBox from './NodeInfoBox'

class NodeInfo extends Component {
  static displayName = 'NodeInfo'

  static propTypes = {
    client: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      showSubmenu: false
    }
  }

  render() {
    const { client } = this.props
    const { showSubmenu, sticky } = this.state
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
          <NodeInfoDot sticky={sticky} />

          {showSubmenu && <NodeInfoBox />}
        </div>
      </StyledNode>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
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
