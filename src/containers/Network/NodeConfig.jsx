import React, { Component } from 'react'
import styled from 'styled-components'
import { NodeSettings } from 'ethereum-react-components'
import { Mist } from '../../API'

const { geth } = Mist

export default class NodeConfig extends Component {
  state = {
    isCheckingForUpdate: false,
    status: {},
    config: {},
    options: {
      syncModes: ['light', 'fast', 'full'],
      versions: [
        '1.8.20-stable',
        '1.8.10-stable',
        '1.7.0-stable',
        '1.6.0-stable'
      ],
      ipcOptions: ['http', 'rpc'],
      networks: ['main', 'ropsten', 'rinkeby', 'kovan']
    }
  }

  componentDidMount = async () => {
    const config = await geth.getConfig()
    const status = await geth.getStatus()
    console.log('geth: ', config, status)
    this.setState({
      config,
      status
    })
  }

  updateStatus = status => {
    this.setState({ status })
    console.log('New status: ', status)
  }

  changeConfig = async config => {
    try {
      const result = await geth.setConfig(config)
      console.log('Config changed to: ', result)
    } catch (error) {
      console.log('Changing config failed: ', error)
    }
  }

  checkUpdate = () => {
    this.setState({ isCheckingForUpdate: true }, () => {
      setTimeout(() => {
        this.setState({ isCheckingForUpdate: false })
      }, 2000)
    })
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

    console.log('∆∆∆ newStatus', newStatus)

    // this.setState({
    // FIXME status: newStatus
    // })
  }

  render() {
    const { status, config, options, isCheckingForUpdate } = this.state
    return (
      <StyledContainer>
        <NodeSettings
          status={status}
          config={config}
          options={options}
          updateStatus={this.updateStatus}
          changeConfig={this.changeConfig}
          onStartStop={this.handleStartStop}
          isCheckingForUpdate={isCheckingForUpdate}
          checkUpdate={this.checkUpdate}
        />
      </StyledContainer>
    )
  }
}

const StyledContainer = styled.main`
  padding: 20px;
  form {
    padding: 30px;
  }
`
