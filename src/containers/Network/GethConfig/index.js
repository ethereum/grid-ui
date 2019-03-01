import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Button from '../../../components/Button'
import { Mist } from '../../../API'
import VersionList from './VersionList'
import ConfigForm from './ConfigForm'
import Terminal from '../Terminal'

const { geth } = Mist

export default class GethConfig extends Component {
  state = {
    isRunning: false
  }

  constructor(props) {
    super(props)
    this.configFormRef = React.createRef()
    this.versionListRef = React.createRef()
  }

  renderVersionList = () => {
    return <VersionList ref={this.versionListRef} />
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
      await geth.stop()
    } else {
      // Save config
      const { config } = this.configFormRef.current.state
      await geth.setConfig(config)
      // Start geth
      const { selectedRelease } = this.versionListRef.current.state
      await geth.start(selectedRelease)
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
          </StyledRunning>
          <Button onClick={() => this.handleStartStop()}>
            {isRunning ? 'stop' : 'start'}
          </Button>
        </div>
      </div>
    )
  }

  renderTerminal = () => {
    if (geth.getLogs().length === 0) {
      return null
    }
    return (
      <div style={{ marginTop: 20 }}>
        <Typography variant="h6">Terminal</Typography>
        <Terminal />
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
        {this.renderVersionList()}
        {this.renderConfigForm()}
        {this.renderStartStop()}
        {this.renderTerminal()}
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

const StyledError = styled.div`
  color: red;
`
