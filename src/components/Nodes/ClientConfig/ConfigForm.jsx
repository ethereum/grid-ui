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
import { Grid as GridAPI } from '../../../API'
// import { setConfig } from '../../../store/client/actions'

const { openFolderDialog } = GridAPI

class ConfigForm extends Component {
  static propTypes = {
    client: PropTypes.object,
    clientConfigChanged: PropTypes.func,
    isClientRunning: PropTypes.bool
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
    // const { client } = this.props
    // const { config } = client
    // FIXME const defaultConfig = geth.getConfig()
    // this.setConfig({ config: defaultConfig })
  }

  setConfig({ config }) {
    const { clientConfigChanged } = this.props
    // don't let the main process handle the fieldname flag conversion
    // instead let's assume that the client expects a valid config object
    const { dataDir, network, host, port, syncMode, ipc } = config

    const flagConfig = {}

    if (dataDir) {
      flagConfig['--datadir'] = dataDir
    }

    if (syncMode) {
      flagConfig['--syncmode'] = syncMode
    }

    if (network) {
      switch (network) {
        case 'main':
          flagConfig['--networkid'] = 1
          break
        case 'ropsten':
          flagConfig['--testnet'] = ''
          break
        case 'rinkeby':
          flagConfig['--rinkeby'] = ''
          break
        default:
          throw new Error('Geth: Unsupported Network')
      }
    }

    if (ipc) {
      switch (ipc.toLowerCase()) {
        case 'websockets':
          flagConfig['--ws --wsaddr'] = host
          flagConfig['--wsport'] = port
          // ToDo: set --wsorigins for security
          break
        case 'http':
          throw new Error('Geth: HTTP is deprecated')
        default:
          break
      }
    }

    clientConfigChanged(flagConfig)
  }

  handleChangeDataDir = event => {
    const { client } = this.props
    const { config } = client
    let dataDir = event.target.value
    if (event.target.files) {
      dataDir = event.target.files
    }
    const newConfig = { ...config, dataDir }
    this.setConfig({ config: newConfig })
  }

  handleChangeSyncMode = syncMode => {
    const { client } = this.props
    const { config } = client
    const newConfig = { ...config, syncMode }
    this.setConfig({ config: newConfig })
  }

  handleChangeIpc = ipc => {
    const { client } = this.props
    const { config } = client
    const newConfig = { ...config, ipc }
    this.setConfig({ config: newConfig })
  }

  handleChangeNetwork = network => {
    const { client } = this.props
    const { config } = client
    const newConfig = { ...config, network }
    this.setConfig({ config: newConfig })
  }

  handleChangeHost = event => {
    const { client } = this.props
    const { config } = client
    const host = event.target.value
    const newConfig = { ...config, host }
    this.setConfig({ config: newConfig })
  }

  handleChangePort = event => {
    const { client } = this.props
    const { config } = client
    const port = Number(event.target.value)
    const newConfig = { ...config, port }
    this.setConfig({ config: newConfig })
  }

  capitalizeLabel = label => label.charAt(0).toUpperCase() + label.slice(1)

  shouldRenderRpcHostPort = () => {
    const { client } = this.props
    const { config } = client
    const { ipc } = config
    return ipc === 'ipc'
  }

  isRunning = () => {
    const { isClientRunning } = this.props
    return isClientRunning
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

    const availableSyncModes = syncModes.map(node => ({
      label: this.capitalizeLabel(node),
      value: node
    }))

    return (
      <Select
        name="Sync Mode"
        defaultValue={syncMode || 'light'}
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

    const availableNetworks = networks.map(node => ({
      label: this.capitalizeLabel(node),
      value: node
    }))

    return (
      <Select
        name="Network"
        defaultValue={network || 'main'}
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
        value={host || ''}
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
        value={port || ''}
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
          value={dataDir || ''}
          onChange={this.handleChangeDataDir}
          disabled={this.isRunning()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={this.isRunning()}
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
          webkitdirectory="true"
          directory="true"
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
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(ConfigForm)

const StyledWarning = styled.div`
  color: red;
`
