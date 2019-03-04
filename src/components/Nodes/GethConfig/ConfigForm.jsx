import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import Select from '../../shared/Select'
import { Mist } from '../../../API'

const { geth } = Mist

export default class ConfigForm extends Component {
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
      ipcModes: ['ipc', 'websockets'],
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
    const { config } = this.state
    const dataDir = event.target.value
    const newConfig = { ...config, dataDir }
    this.setState({ config: newConfig })
  }

  handleChangeSyncMode = syncMode => {
    const { config } = this.state
    const newConfig = { ...config, syncMode }
    this.setState({ config: newConfig })
  }

  handleChangeIpc = ipc => {
    const { config } = this.state
    const newConfig = { ...config, ipc }
    this.setState({ config: newConfig })
  }

  handleChangeNetwork = network => {
    const { config } = this.state
    const newConfig = { ...config, network }
    this.setState({ config: newConfig })
  }

  handleChangeHost = event => {
    const { config } = this.state
    const host = event.target.value
    const newConfig = { ...config, host }
    this.setState({ config: newConfig })
  }

  handleChangePort = event => {
    const { config } = this.state
    const port = Number(event.target.value)
    const newConfig = { ...config, port }
    this.setState({ config: newConfig })
  }

  capitalizeLabel = label => label.charAt(0).toUpperCase() + label.slice(1)

  shouldRenderRpcHostPort = () => {
    const { config } = this.state
    const { ipc } = config
    if (!ipc || ipc === 'ipc') {
      return false
    }
    return true
  }

  renderSyncMode() {
    const { options, config } = this.state
    const { syncMode } = config
    const { syncModes } = options
    if (!syncMode) {
      return null
    }
    const availableSyncModes = syncModes.map(node => ({
      label: this.capitalizeLabel(node),
      value: node
    }))
    return (
      <Select
        name="Sync Mode"
        defaultValue={syncMode}
        options={availableSyncModes}
        onChange={this.handleChangeSyncMode}
      />
    )
  }

  renderNetwork() {
    const { options, config } = this.state
    const { networks } = options
    const { network } = config
    if (!network) {
      return null
    }
    const availableNetworks = networks.map(node => ({
      label: this.capitalizeLabel(node),
      value: node
    }))
    return (
      <Select
        name="Network"
        defaultValue={network}
        options={availableNetworks}
        onChange={this.handleChangeNetwork}
      />
    )
  }

  renderRpcHost() {
    const { config } = this.state
    const { host } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Host"
        value={host}
        onChange={this.handleChangeHost}
      />
    )
  }

  renderRpcPort() {
    const { config } = this.state
    const { port } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Port"
        value={port}
        onChange={this.handleChangePort}
      />
    )
  }

  renderDataDir() {
    const { config } = this.state
    const { dataDir } = config
    return (
      <TextField
        variant="outlined"
        label="Data Directory"
        value={dataDir}
        onChange={this.handleChangeDataDir}
      />
    )
  }

  renderIpc() {
    const { options, config } = this.state
    const { ipc } = config
    const { ipcModes } = options
    if (!ipc) {
      return null
    }
    const capitalizeIpcLabel = ipcLabel => {
      let capitalizedLabel
      if (ipcLabel === 'ipc') {
        capitalizedLabel = 'IPC'
      } else if (ipcLabel === 'websockets') {
        capitalizedLabel = 'WebSockets'
      }
      return capitalizedLabel
    }
    const availableIpc = ipcModes.map(node => ({
      label: capitalizeIpcLabel(node),
      value: node
    }))
    return (
      <div>
        <Select
          name="IPC"
          defaultValue={ipc}
          options={availableIpc}
          onChange={this.handleChangeIpc}
        />
        {ipc === 'http' && (
          <StyledWarning>
            Warning: http is insecure and deprecated
          </StyledWarning>
        )}
      </div>
    )
  }

  render() {
    return (
      <div>
        <Grid container style={{ maxWidth: 500 }} spacing={24}>
          <Grid item xs={6}>
            {this.renderDataDir()}
          </Grid>
          <Grid item xs={6}>
            {this.renderIpc()}
          </Grid>
          {this.shouldRenderRpcHostPort() && (
            <React.Fragment>
              <Grid item xs={6}>
                {this.renderRpcHost()}
              </Grid>
              <Grid item xs={6}>
                {this.renderRpcPort()}
              </Grid>
            </React.Fragment>
          )}
          <Grid item xs={6}>
            {this.renderSyncMode()}
          </Grid>
          <Grid item xs={6}>
            {this.renderNetwork()}
          </Grid>
        </Grid>
      </div>
    )
  }
}

const StyledWarning = styled.div`
  color: red;
`
