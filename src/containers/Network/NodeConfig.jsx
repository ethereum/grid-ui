import React, { Component } from 'react'
import {
  Button,
  Input,
  FileChooser,
  Select,
  NodeInfoBox
} from 'ethereum-react-components'
import './NodeConfig.css'
import NodeSettingsForm from './NodeSettingsForm'
import { Mist } from '../../API'

const { geth } = Mist

class NodeConfig extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: {
        node: 'geth',
        binPath: 'binPath',
        version: '1.8.20-stable',
        commit: '24d727b6d6e2c0cde222fa12155c4a6db5caaf2e',
        architecture: 'amd64',
        go: 'go1.11.2',
        isRunning: false
      },
      config: {
        name: 'default',
        dataDir: 'F:/Ethereum',
        host: 'localhost',
        port: 8545,
        network: 'main'
      },
      releases: ['latest', '1234', '4567']
    }
  }

  componentDidMount = async () => {
    // let config = await geth.getConfig()
    // let status = await geth.getStatus()
    const config = {}
    const status = {}
    console.log('geth: ', config, status)
    /*
    this.setState({
      config,
      status
    })
    */
  }

  handleSaveTemplate = async () => {
    const version = await geth.version()
    console.log('geth version: ', version)
  }

  handleChangeConfig = async () => {
    try {
      const result = await geth.setConfig({ port: '8434' })
      console.log('changed to', result)
    } catch (error) {
      console.log('changing config failed', error)
    }
  }

  handleStartStop = async () => {
    const { status } = this.state
    const { isRunning } = status
    let newStatus = {}
    if (isRunning) {
      newStatus = await geth.stop()
    } else {
      newStatus = await geth.start()
    }
    this.setState({
      // FIXME status: newStatus
    })
  }

  render() {
    const { status, config } = this.state
    const { binPath, node } = status
    const nodeName = node

    const templates = [{ label: 'default config', value: 'default' }]
    const selectedTemplate = templates[0]

    const initial = {
      active: 'remote',
      network: 'main',
      changingNetwork: false,
      remote: {
        client: 'infura',
        blockNumber: 100,
        timestamp: 0
      },
      local: {
        client: 'geth',
        blockNumber: 1,
        timestamp: 0,
        syncMode: 'fast',
        sync: {
          connectedPeers: 0,
          currentBlock: 0,
          highestBlock: 0,
          knownStates: 0,
          pulledStates: 0,
          startingBlock: 0
        }
      }
    }

    return (
      <main className="node-config">
        <h1>Node Settings</h1>
        <h3>Node: {nodeName}</h3>
        <h3>Path: {binPath}</h3>

        {/*
        <div style={{width: '75%'}}>
          <div className="setting">
            Template: <br />
            <div
              style={{width: '300px', display: 'inline-block'}}
            >
              <Select
                value={selectedTemplate}
                options={templates}
              />
            </div>
          </div>

          <NodeSettingsForm
            config={config}
            status={status}
            onStartStop={this.handleStartStop}
          />
        </div>
        */}

        <div style={{ width: '24%' }}>
          {/** <NodeInfoBox {...initial} /> */}
        </div>

        <Button style={{ marginTop: 30 }} onClick={this.handleSaveTemplate}>
          save template
        </Button>
        <Button style={{ marginTop: 30 }} onClick={this.handleChangeConfig}>
          apply changes
        </Button>
      </main>
    )
  }
}

export default NodeConfig
