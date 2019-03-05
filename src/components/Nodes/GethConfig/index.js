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

const { geth } = Mist

class GethConfig extends Component {
  state = {
    downloadError: null
  }

  constructor(props) {
    super(props)

    this.configFormRef = React.createRef()
    this.versionListRef = React.createRef()

    const { dispatch } = this.props
    this.clientStateManager = new ClientStateManager({ dispatch })
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

  handleStartStop = () => {
    const { isRunning } = geth
    if (isRunning) {
      this.clientStateManager.stop()
      geth.stop()
    } else {
      // Save config
      const { config } = this.configFormRef.current.state
      geth.setConfig(config)
      // Start geth
      const { selectedRelease } = this.versionListRef.current.state
      geth.start(selectedRelease)
      this.clientStateManager.start()
    }
  }

  renderStartStop = () => {
    const { client } = this.props
    const { state } = client
    const { isRunning } = geth
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

  renderErrors() {
    const { downloadError } = this.state
    const { client } = this.props
    const { error } = client

    const errorMessage = (error && error.toString()) || downloadError

    if (!errorMessage) {
      return null
    }

    return <StyledError>{errorMessage}</StyledError>
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
        blockNumber: null,
        timestamp: null
      }
    }

    return (
      <main>
        <NodeInfo {...nodeInfoProps} />
        <VersionList ref={this.versionListRef} />
        {this.renderConfigForm()}
        {this.renderStartStop()}
        {this.renderErrors()}
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

export default connect(mapStateToProps)(GethConfig)

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
  padding: 10px;
  color: red;
`
