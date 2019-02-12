/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react'
import { Button, Input, FileChooser } from 'ethereum-react-components'
import { Mist } from '../../API'
import ClientDownload from './ClientDownload'
import ClientSelect from './ClientSelect'
import Terminal from './Terminal'

const { geth } = Mist

class ClientConfigForm extends Component {
  handleDataDirectoryChanged = () => {}

  render() {
    const config = {
      host: 'localhost',
      port: 8454,
      dataDir: '~/.ethereum'
    }
    return (
      <div>
        <div className="setting">
          RPC Host &amp; Port: <br />
          <Input type="text" value={config.host} style={{ marginRight: 10 }} />
          <Input type="text" value={config.port} />
        </div>

        <div className="setting">
          Data directory: <br />
          <Input type="text" value={config.dataDir} />
          <FileChooser onChange={this.handleDataDirectoryChanged} />
        </div>
      </div>
    )
  }
}

export default class NodeSetup extends Component {
  state = {
    clientDownloaded: false,
    selectedClient: null,
    installedBinaries: [], // eslint-disable-line
    isRunning: false
  }

  componentDidMount = async () => {
    this.loadCachedVersions()
  }

  loadCachedVersions = async () => {
    const installedBinaries = await geth.getLocalBinaries()
    console.log(installedBinaries.length)
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

  handleClientSelected = selectedClient => {
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
        <ClientConfigForm />
      </div>
    )
  }

  handleStartStop = async () => {
    const { isRunning, selectedClient } = this.state
    if (isRunning) {
      await geth.stop()
    } else {
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
          <span>
            Running:{' '}
            {isRunning ? (
              <span style={{ color: 'green' }}>true</span>
            ) : (
              <span style={{ color: 'red' }}>false</span>
            )}
          </span>
          <Button onClick={() => this.handleStartStop(isRunning)}>
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
