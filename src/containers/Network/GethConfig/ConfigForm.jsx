import React, { Component } from 'react'
import { Input, Select, Grid } from 'ethereum-react-components'
import styled, { css } from 'styled-components'
import ReactDOM from 'react-dom'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import MenuItem from '@material-ui/core/MenuItem'

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

  constructor(props) {
    super(props)
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
    const newConfig = { ...config, dataDir: event.target.value }
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
    const newConfig = { ...config, host: event.target.value }
    this.setState({ config: newConfig })
  }

  handleChangePort = event => {
    const { config } = this.state
    const newConfig = { ...config, port: Number(event.target.value) }
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
      <FormControl variant="outlined" fullWidth>
        <InputLabel
          ref={ref => {
            this.rpcHostRef = ReactDOM.findDOMNode(ref)
          }}
          htmlFor="rpc-host-input"
        >
          RPC Host
        </InputLabel>
        <OutlinedInput
          id="rpc-host-input"
          value={host}
          onChange={this.handleChangeHost}
          labelWidth={this.rpcHostRef ? this.rpcHostRef.offsetWidth : 0}
        />
      </FormControl>
    )
  }

  renderRpcPort() {
    const { config } = this.state
    const { port } = config
    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel
          ref={ref => {
            this.rpcPortRef = ReactDOM.findDOMNode(ref)
          }}
          htmlFor="rpc-port-input"
        >
          RPC Port
        </InputLabel>
        <OutlinedInput
          id="rpc-port-input"
          value={port}
          onChange={this.handleChangePort}
          labelWidth={this.rpcPortRef ? this.rpcPortRef.offsetWidth : 0}
        />
      </FormControl>
    )
  }

  renderDataDir() {
    const { config } = this.state
    const { dataDir } = config
    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel
          ref={ref => {
            this.dataDirLabelRef = ReactDOM.findDOMNode(ref)
          }}
          htmlFor="data-dir-input"
        >
          Data Directory
        </InputLabel>
        <OutlinedInput
          id="data-dir-input"
          value={dataDir}
          onChange={this.handleChangeDataDir}
          labelWidth={
            this.dataDirLabelRef ? this.dataDirLabelRef.offsetWidth : 0
          }
        />
      </FormControl>
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
