import React, { Component } from 'react'
import { Button } from 'ethereum-react-components'
import styled, { css } from 'styled-components'
import { Mist } from '../../../API'
import ClientConfigForm from './ClientConfigForm'
import ClientDownload from './ClientDownload'
import ClientSelect from './ClientSelect'
import Terminal from '../Terminal'

const { geth } = Mist

export default class NodeSetup extends Component {
  state = {
    clientDownloaded: false,
    selectedClient: null,
    installedBinaries: [], // eslint-disable-line
    isRunning: false
  }

  constructor(props) {
    super(props)
    this.clientConfigForm = React.createRef()
  }

  componentDidMount = async () => {
    this.loadCachedVersions()
  }

  loadCachedVersions = async () => {
    const installedBinaries = await geth.getLocalBinaries()
    this.setState({
      installedBinaries, // eslint-disable-line
      clientDownloaded: installedBinaries.length > 0
    })
    if (installedBinaries.length === 1) {
      this.setState({
        selectedClient: installedBinaries[0]
      })
    }
  }

  handleClientDownloaded = () => {
    this.loadCachedVersions()
  }

  renderStep1 = () => {
    return (
      <div>
        <h2>1. Download Client Binaries</h2>
        <ClientDownload onClientDownloaded={this.handleClientDownloaded} />
      </div>
    )
  }

  handleClientSelected = selected => {
    const selectedClient = selected.value
    this.setState({
      selectedClient
    })
  }

  renderStep2 = () => {
    return (
      <div>
        <h2>2. Select Client Binaries</h2>
        <ClientSelect onClientSelected={this.handleClientSelected} />
        Validation Result:
      </div>
    )
  }

  renderStep3 = () => {
    return (
      <div>
        <h2>3. Configure Client</h2>
        <ClientConfigForm ref={this.clientConfigForm} />
      </div>
    )
  }

  handleStartStop = async () => {
    const { isRunning, selectedClient } = this.state
    if (isRunning) {
      await geth.stop()
    } else {
      // Save config
      const { config } = this.clientConfigForm.current.state
      await geth.setConfig(config)
      // Start geth
      await geth.start(selectedClient)
    }
    this.setState({
      isRunning: !isRunning
    })
  }

  renderStep4 = () => {
    const { isRunning } = this.state
    return (
      <div>
        <h2>4. Start Client</h2>
        <div className="setting">
          <StyledRunning isRunning={isRunning}>
            Running: {isRunning ? <span>Yes</span> : <span>No</span>}
          </StyledRunning>
          <Button onClick={() => this.handleStartStop()}>
            {isRunning ? 'stop' : 'start'}
          </Button>
        </div>
      </div>
    )
  }

  renderStep5 = () => {
    return (
      <div>
        <h2>5. Monitor Health</h2>
        <Terminal />
      </div>
    )
  }

  render() {
    const { clientDownloaded, selectedClient, isRunning } = this.state
    return (
      <main>
        <h1>Setup Client</h1>
        {this.renderStep1()}
        {clientDownloaded && this.renderStep2()}
        {clientDownloaded && selectedClient && this.renderStep3()}
        {clientDownloaded && selectedClient && this.renderStep4()}
        {clientDownloaded && selectedClient && isRunning && this.renderStep5()}
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
      `} ${props =>
      !props.isRunning &&
      css`
        color: red;
      `};
  }
`
