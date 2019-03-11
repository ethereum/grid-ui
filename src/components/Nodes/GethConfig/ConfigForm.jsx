import React, { Component } from 'react'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import MinimizeIcon from '@material-ui/icons/Minimize'
import MaximizeIcon from '@material-ui/icons/Maximize'
import Select from '../../shared/Select'
import { Mist } from '../../../API'
import { setConfig } from '../../../store/client/actions'

const { geth } = Mist

class ConfigForm extends Component {
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
    },
    showForm: true
  }

  componentDidMount() {
    this.getConfig()
  }

  componentDidUpdate(prevProps, prevState) {
    const { config } = this.state
    if (prevState.config !== config) {
      const { dispatch } = this.props
      dispatch(setConfig({ config }))
    }
  }

  async getConfig() {
    const config = await geth.getConfig()
    this.setState({ config })
  }

  handleChangeDataDir = dataDir => {
    const { config } = this.state
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

  toggleShowForm = () => {
    const { showForm } = this.state
    this.setState({ showForm: !showForm })
  }

  renderSyncMode() {
    const { isRunning } = geth
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
        disabled={isRunning}
      />
    )
  }

  renderNetwork() {
    const { isRunning } = geth
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
        disabled={isRunning}
      />
    )
  }

  renderRpcHost() {
    const { isRunning } = geth
    const { config } = this.state
    const { host } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Host"
        value={host}
        onChange={this.handleChangeHost}
        disabled={isRunning}
      />
    )
  }

  renderRpcPort() {
    const { isRunning } = geth
    const { config } = this.state
    const { port } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Port"
        value={port}
        onChange={this.handleChangePort}
        disabled={isRunning}
      />
    )
  }

  renderDataDir() {
    const { isRunning } = geth
    const { config } = this.state
    const { dataDir } = config
    return (
      <TextField
        variant="outlined"
        label="Data Directory"
        value={dataDir}
        onChange={this.handleChangeDataDir}
        disabled={isRunning}
      />
    )
  }

  renderIpc() {
    const { isRunning } = geth
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
          disabled={isRunning}
        />
        {ipc === 'http' && (
          <StyledWarning>
            Warning: http is insecure and deprecated
          </StyledWarning>
        )}
      </div>
    )
  }

  renderForm() {
    const { showForm } = this.state
    if (!showForm) {
      return null
    }

    return (
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
    )
  }

  render() {
    const { showForm } = this.state
    return (
      <div>
        <ToggableTypography
          variant="h6"
          gutterBottom
          onClick={this.toggleShowForm}
        >
          {showForm ? (
            <MinimizeIcon fontSize="small" />
          ) : (
            <MaximizeIcon fontSize="small" />
          )}
          Settings
        </ToggableTypography>
        {this.renderForm()}
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(ConfigForm)

const StyledWarning = styled.div`
  color: red;
`

const ToggableTypography = styled(Typography)`
  user-select: none;
  &:hover {
    cursor: pointer;
  }
`
