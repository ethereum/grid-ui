import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import Typography from '@material-ui/core/Typography'
import Button from '../../shared/Button'
import { Mist } from '../../../API'
import VersionList from './VersionList'
import ConfigForm from './ConfigForm'
import Terminal from '../Terminal'
import NodeInfo from '../NodeInfo'
import ClientStateManager from '../../../lib/ClientStateManager'
import { startGeth, stopGeth } from '../../../store/client/actions'

const { geth } = Mist

class GethConfig extends Component {
  constructor(props) {
    super(props)

    this.configFormRef = React.createRef()
    this.versionListRef = React.createRef()

    const { dispatch } = this.props
    this.clientStateManager = new ClientStateManager(dispatch)
  }

  renderConfigForm = () => {
    return (
      <div>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <ConfigForm ref={this.configFormRef} />
      </div>
    )
  }

  handleStartStop = async () => {
    const { client, onStart, onStop } = this.props
    const { isRunning } = client
    if (isRunning) {
      onStop(this.clientStateManager)
    } else {
      // Save config
      const { config } = this.configFormRef.current.state
      await geth.setConfig(config)
      // Start geth
      const { selectedRelease } = this.versionListRef.current.state
      onStart(selectedRelease, this.clientStateManager)
    }
  }

  renderStartStop = () => {
    const { client } = this.props
    const { isRunning, state } = client
    return (
      <div style={{ marginTop: 40 }}>
        <Typography variant="h6">Status</Typography>
        <div className="setting">
          <StyledRunning isRunning={isRunning}>
            <Typography variant="body1">
              Running: {isRunning ? <span>Yes</span> : <span>No</span>}
            </Typography>
            <Typography variant="subtitle2">
              <StyledState>{state}</StyledState>
            </Typography>
          </StyledRunning>
          <Button onClick={() => this.handleStartStop()}>
            {isRunning ? 'stop' : 'start'}
          </Button>
        </div>
      </div>
    )
  }

  renderDownloadError() {
    const { downloadError } = this.state
    if (!downloadError) {
      return null
    }

    return <StyledError>{downloadError}</StyledError>
  }

  render() {
    const { client } = this.props
    const {
      network,
      syncMode,
      blockNumber,
      timestamp,
      sync,
      peerCount
    } = client
    const { highestBlock, currentBlock, startingBlock } = sync

    const nodeInfoProps = {
      active: 'local',
      network,
      local: {
        syncMode,
        blockNumber,
        timestamp,
        sync: {
          highestBlock,
          currentBlock,
          startingBlock,
          connectedPeers: peerCount
        }
      },
      remote: {
        blockNumber: 0,
        timestamp: null
      }
    }

    return (
      <main>
        <NodeInfo {...nodeInfoProps} />
        <VersionList ref={this.versionListRef} />
        {this.renderConfigForm()}
        {this.renderStartStop()}
        {!!geth.getLogs().length && <Terminal />}
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onStart: (release, clientStateManager) => {
      dispatch(startGeth({ release, clientStateManager }))
    },
    onStop: clientStateManager => {
      dispatch(stopGeth({ clientStateManager }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GethConfig)

const StyledRunning = styled.div`
  margin-bottom: 10px;
  font-weight: normal;
  span {
    ${props =>
      props.isRunning &&
      css`
        color: green;
      `}
    ${props =>
      !props.isRunning &&
      css`
        color: red;
      `};
  }
`

const StyledState = styled.div`
  text-transform: capitalize !important;
  font-style: italic;
  font-size: 80%;
  margin: 5px 0;
`

const StyledError = styled.div`
  color: red;
`
