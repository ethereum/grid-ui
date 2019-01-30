import React, { Component } from 'react'
import {
  Button,
  Input,
  FileChooser,
  Select,
  NetworkChooser
} from 'ethereum-react-components'

class NodeSettingsForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isCheckingForUpdate: false
    }
  }

  handleStartStop = async isRunning => {
    const { onStartStop } = this.props
    onStartStop()
  }

  handleCheckUpdate = async () => {
    const { geth } = window.Mist
    this.setState({
      isCheckingForUpdate: true
    })
    let result = await geth.checkForUpdates()
    console.log('check update result: ', result)
    // window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
  }

  render() {
    const { status, config } = this.props
    const { isRunning, version } = status

    const availableNodes = [version].map(node => ({
      label: node,
      value: node
    }))
    let selectedVersion = availableNodes[0]

    const availableSyncModes = ['full', 'light'].map(node => ({
      label: node,
      value: node
    }))
    let selectedSyncMode = availableSyncModes[0]

    let IpcOptions = [{ label: 'http', value: 'http' }]
    let selectedIpc = IpcOptions[0]

    return (
      <form
        style={{
          marginBottom: 10,
          marginTop: 10,
          border: '1px solid lightgrey',
          padding: 20,
          borderRadius: 3
        }}
      >
        <div className="setting">
          Version: <br />
          <div style={{ width: '300px', display: 'inline-block' }}>
            <Select value={selectedVersion} options={availableNodes} />
          </div>
          <Button
            loading={this.state.isCheckingForUpdate}
            flat
            style={{ marginLeft: 10 }}
            onClick={this.handleCheckUpdate}
          >
            check update
          </Button>
        </div>

        <div className="setting" style={{ display: 'inline-block' }}>
          Network: <br />
          <div style={{ width: '300px' }}>
            <NetworkChooser selected="main" />
          </div>
        </div>

        <div
          className="setting"
          style={{ display: 'inline-block', marginLeft: 10 }}
        >
          Syncmode: <br />
          <div style={{ width: '300px' }}>
            <Select value={selectedSyncMode} options={availableSyncModes} />
          </div>
        </div>

        <div className="setting">
          RPC Host &amp; Port: <br />
          <Input type="text" value={config.host} style={{ marginRight: 10 }} />
          <Input type="text" value={config.port} />
        </div>

        <div className="setting">
          Data directory: <br />
          <Input type="text" value={config.dataDir} />
          <FileChooser />
        </div>

        <div className="setting">
          IPC: <br />
          <div style={{ width: '300px' }}>
            <Select value={selectedIpc} options={IpcOptions} />
          </div>
          <strong>Warning: http is insecure and deprecated</strong>
        </div>

        <div className="setting">
          <span>
            Running:{' '}
            {isRunning ? (
              <span style={{ color: 'green' }}>true</span>
            ) : (
              <span style={{ color: 'red' }}>false</span>
            )}
          </span>
          <Button flat onClick={() => this.handleStartStop(isRunning)}>
            {isRunning ? 'stop' : 'start'}
          </Button>
        </div>
      </form>
    )
  }
}

export default NodeSettingsForm
