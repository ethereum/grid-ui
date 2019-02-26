import React, { Component } from 'react'
import { Input, FileChooser, Select } from 'ethereum-react-components'
import styled, { css } from 'styled-components'
import { Mist } from '../../../API'

const { geth } = Mist

export default class ClientConfigForm extends Component {
  state = {
    config: {
      name: '',
      dataDir: '',
      host: '',
      port: '',
      network: '',
      syncMode: '',
      ipc: ''
    },
    options: {
      networks: ['main', 'ropsten', 'rinkeby'],
      ipcModes: ['IPC', 'WebSockets'],
      syncModes: ['light', 'fast', 'full']
    }
  }

  componentDidMount() {
    this.getConfig()
  }

  async getConfig() {
    const config = await geth.getConfig()
    this.setState({ config })
  }

  handleChangeDataDir = event => {
    // event.target.value returns `fakepath` in electron due to security reasons.
    // Would need to use electron's remote dialog.showOpenDialog()
    const { config } = this.state
    const newConfig = { ...config, dataDir: event.target.value }
    this.setState({ config: newConfig })
  }

  handleChangeSyncMode = selectedOption => {
    const { config } = this.state
    const syncMode = selectedOption.value
    const newConfig = { ...config, syncMode }
    this.setState({ config: newConfig })
  }

  handleChangeIpc = selectedOption => {
    const { config } = this.state
    const ipc = selectedOption.value
    const newConfig = { ...config, ipc }
    this.setState({ config: newConfig })
  }

  handleChangeNetwork = selectedOption => {
    const { config } = this.state
    const network = selectedOption.value
    const newConfig = { ...config, network }
    this.setState({ config: newConfig })
  }

  handleChangeHost = event => {
    const { config } = this.state
    const newConfig = { ...config, host: event.target.value }
    this.setState({ config: newConfig })
  }

  handleChangePort = event => {
    const { config } = this.state
    const newConfig = { ...config, port: Number(event.target.value) }
    this.setState({ config: newConfig })
  }

  renderNetwork() {
    const { options, config } = this.state
    const { networks } = options
    const { network } = config
    const availableNetworks = networks.map(node => ({
      label: node,
      value: node
    }))
    const selectedNetwork = {
      label: network,
      value: network
    }
    return (
      <StyledSetting>
        <StyledLabel>Network</StyledLabel>
        <StyledSelect
          value={selectedNetwork}
          options={availableNetworks}
          onChange={this.handleChangeNetwork}
          capitalize
        />
      </StyledSetting>
    )
  }

  renderSyncMode() {
    const { options, config } = this.state
    const { syncMode } = config
    const { syncModes } = options
    const availableSyncModes = syncModes.map(node => ({
      label: node,
      value: node
    }))
    const selectedSyncMode = {
      label: syncMode,
      value: syncMode
    }
    return (
      <StyledSetting>
        <StyledLabel>Sync Mode</StyledLabel>
        <StyledSelect
          value={selectedSyncMode}
          options={availableSyncModes}
          onChange={this.handleChangeSyncMode}
          capitalize
        />
      </StyledSetting>
    )
  }

  renderRpcHostPort() {
    const { config } = this.state
    const { ipc, host, port } = config

    if (!ipc || ipc.toLowerCase() === 'ipc') {
      return null
    }

    return (
      <StyledSetting>
        <StyledLabel>{ipc} RPC Host &amp; Port</StyledLabel>
        <StyledInput
          type="text"
          value={host}
          onChange={this.handleChangeHost}
          style={{ marginRight: '10px' }}
        />
        <StyledInput
          type="text"
          value={port}
          onChange={this.handleChangePort}
        />
      </StyledSetting>
    )
  }

  renderDataDir() {
    const { config } = this.state
    const { dataDir } = config
    return (
      <StyledSetting>
        <StyledLabel>Data Directory</StyledLabel>
        <StyledInput
          type="text"
          value={dataDir}
          onChange={this.handleChangeDataDir}
          style={{ marginRight: '10px' }}
        />
        <FileChooser onChange={this.handleChangeDataDir} hidden />
      </StyledSetting>
    )
  }

  renderIpc() {
    const { options, config } = this.state
    const { ipc } = config
    const { ipcModes } = options
    const availableIpc = ipcModes.map(node => ({
      label: node,
      value: node
    }))
    const selectedIpc = { label: ipc, value: ipc }
    return (
      <StyledSetting>
        <StyledLabel>IPC</StyledLabel>
        <StyledSelect
          value={selectedIpc}
          options={availableIpc}
          onChange={this.handleChangeIpc}
        />
        {ipc === 'http' && (
          <StyledWarning>
            Warning: http is insecure and deprecated
          </StyledWarning>
        )}
      </StyledSetting>
    )
  }

  render() {
    return (
      <div>
        {this.renderDataDir()}
        {this.renderIpc()}
        {this.renderRpcHostPort()}
        {this.renderSyncMode()}
        {this.renderNetwork()}
      </div>
    )
  }
}

const StyledSetting = styled.div`
  margin: 0 0 20px 0;
  position: relative;
  &:last-of-type {
    margin-bottom: 0;
  }
`

const StyledLabel = styled.div`
  font-weight: bold;
  padding-bottom: 5px;
`

const StyledInput = styled(Input)`
  max-width: 200px;
`

const StyledSelect = styled(Select)`
  max-width: 250px;
  ${props =>
    props.capitalize &&
    css`
      text-transform: capitalize;
    `};
`

const StyledWarning = styled.div`
  color: red;
`
