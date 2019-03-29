import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import styled from 'styled-components'
import Select from '../../shared/Select'
import { Mist } from '../../../API'
import { setConfig } from '../../../store/client/actions'

const { geth, openFolderDialog } = Mist

class ConfigForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    client: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.inputOpenFileRef = React.createRef()
    this.state = {
      options: {
        networks: ['main', 'ropsten', 'rinkeby'],
        ipcModes: ['ipc', 'websockets'],
        syncModes: ['light', 'fast', 'full']
      }
    }
  }

  componentDidMount() {
    this.setDefaultConfig()
  }

  setDefaultConfig() {
    // Set default config if no config set
    const { client, dispatch } = this.props
    const { config } = client
    if (config.name) {
      // Config already set
      return
    }
    const defaultConfig = geth.getConfig()
    dispatch(setConfig({ config: defaultConfig }))
  }

  handleChangeDataDir = event => {
    const { dispatch, client } = this.props
    const { config } = client
    let dataDir = event.target.value
    if (event.target.files) {
      dataDir = event.target.files
    }
    const newConfig = { ...config, dataDir }
    dispatch(setConfig({ config: newConfig }))
  }

  handleChangeSyncMode = syncMode => {
    const { client, dispatch } = this.props
    const { config } = client
    const newConfig = { ...config, syncMode }
    dispatch(setConfig({ config: newConfig }))
  }

  handleChangeIpc = ipc => {
    const { client, dispatch } = this.props
    const { config } = client
    const newConfig = { ...config, ipc }
    dispatch(setConfig({ config: newConfig }))
  }

  handleChangeNetwork = network => {
    const { client, dispatch } = this.props
    const { config } = client
    const newConfig = { ...config, network }
    dispatch(setConfig({ config: newConfig }))
  }

  handleChangeHost = event => {
    const { client, dispatch } = this.props
    const { config } = client
    const host = event.target.value
    const newConfig = { ...config, host }
    dispatch(setConfig({ config: newConfig }))
  }

  handleChangePort = event => {
    const { client, dispatch } = this.props
    const { config } = client
    const port = Number(event.target.value)
    const newConfig = { ...config, port }
    dispatch(setConfig({ config: newConfig }))
  }

  capitalizeLabel = label => label.charAt(0).toUpperCase() + label.slice(1)

  shouldRenderRpcHostPort = () => {
    const { client } = this.props
    const { config } = client
    const { ipc } = config
    if (!ipc || ipc === 'ipc') {
      return false
    }
    return true
  }

  isRunning = () => {
    const { client } = this.props
    return ['STARTING', 'STARTED', 'CONNECTED'].includes(client.state)
  }

  browseDataDir = async event => {
    // If we don't have openFolderDialog from Grid,
    // return true to continue with native file dialog
    if (!openFolderDialog) {
      return true
    }
    event.preventDefault()
    const { client } = this.props
    const { config } = client
    const { dataDir } = config
    const defaultPath = dataDir
    const dir = await openFolderDialog(defaultPath)
    this.handleChangeDataDir({ target: { value: dir } })
    return null
  }

  renderSyncMode() {
    const { options } = this.state
    const { client } = this.props
    const { config } = client
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
        disabled={this.isRunning()}
      />
    )
  }

  renderNetwork() {
    const { options } = this.state
    const { client } = this.props
    const { config } = client
    const { network } = config
    const { networks } = options
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
        disabled={this.isRunning()}
      />
    )
  }

  renderRpcHost() {
    const { client } = this.props
    const { config } = client
    const { host } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Host"
        value={host}
        onChange={this.handleChangeHost}
        disabled={this.isRunning()}
        fullWidth
      />
    )
  }

  renderRpcPort() {
    const { client } = this.props
    const { config } = client
    const { port } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Port"
        value={port}
        onChange={this.handleChangePort}
        disabled={this.isRunning()}
        fullWidth
      />
    )
  }

  renderDataDir() {
    const { client } = this.props
    const { config } = client
    const { dataDir } = config
    return (
      <div>
        <TextField
          variant="outlined"
          label="Data Directory"
          value={dataDir}
          onChange={this.handleChangeDataDir}
          disabled={this.isRunning()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Open folder browser"
                  onClick={() => {
                    if (
                      this.inputOpenFileRef &&
                      this.inputOpenFileRef.current
                    ) {
                      this.inputOpenFileRef.current.click()
                    }
                  }}
                >
                  <FolderOpenIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          fullWidth
        />
        <input
          type="file"
          id="open-file-dialog"
          onChange={this.handleChangeDataDir}
          onClick={this.browseDataDir}
          ref={this.inputOpenFileRef}
          style={{ display: 'none' }}
        />
      </div>
    )
  }

  renderIpc() {
    const { client } = this.props
    const { options } = this.state
    const { config } = client
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
          disabled={this.isRunning()}
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
    return (
      <Grid container style={{ paddingTop: 15 }} spacing={24}>
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
    return <div>{this.renderForm()}</div>
  }
}

function mapStateToProps(state) {
  return { client: state.client }
}

export default connect(mapStateToProps)(ConfigForm)

const StyledWarning = styled.div`
  color: red;
`
