import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Button from '../../../components/Button'
import { Mist, store } from '../../../API'
import VersionList from './VersionList'
import ConfigForm from './ConfigForm'
import Terminal from '../Terminal'
import NodeInfo from '../NodeInfo'
import NodeStateManager from '../../../lib/NodeStateManager'

const { geth } = Mist

export default class GethConfig extends Component {
  state = {
    isRunning: false
  }

  constructor(props) {
    super(props)
    this.configFormRef = React.createRef()
    this.versionListRef = React.createRef()
    this.nodeStateManager = new NodeStateManager()
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
    const { isRunning } = this.state
    if (isRunning) {
      this.nodeStateManager.stop()
      await geth.stop()
    } else {
      // Save config
      const { config } = this.configFormRef.current.state
      await geth.setConfig(config)
      // Start geth
      const { selectedRelease } = this.versionListRef.current.state
      await geth.start(selectedRelease)
      this.nodeStateManager.start()
    }
    this.setState({
      isRunning: !isRunning
    })
  }

  renderStartStop = () => {
    const { isRunning } = this.state
    return (
      <div style={{ marginTop: 40 }}>
        <Typography variant="h6">Status</Typography>
        <div className="setting">
          <StyledRunning isRunning={isRunning}>
            <Typography variant="body1">
              Running: {isRunning ? <span>Yes</span> : <span>No</span>}
            </Typography>
            <Typography variant="subtitle2">
              <StyledState>{geth.state}</StyledState>
            </Typography>
          </StyledRunning>
          <Button onClick={() => this.handleStartStop()}>
            {isRunning ? 'stop' : 'start'}
          </Button>
          {JSON.stringify(store.getState().nodes)}
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
    return (
      <main>
        <VersionList ref={this.versionListRef} />
        {this.renderConfigForm()}
        <NodeInfo {...store.getState().nodes} />
        {this.renderStartStop()}
        {!!geth.getLogs().length && <Terminal />}
      </main>
    )
  }
}

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
