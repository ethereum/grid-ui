import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import MuiGrid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import { Grid } from '../../API'
import { setConfig } from '../../store/signer/actions'

const { clef, openFolderDialog } = Grid

class ConfigForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    signer: PropTypes.object,
    release: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.inputOpenFileRef = React.createRef()
    this.state = {}
  }

  componentDidMount() {
    this.setDefaultConfig()
  }

  setDefaultConfig() {
    // Set default config if no config set
    const { signer, dispatch } = this.props
    const { config } = signer
    if (config.name) {
      // Config already set
      return
    }
    const defaultConfig = clef.getConfig()
    dispatch(setConfig({ config: defaultConfig }))
  }

  handleChangeKeystoreDir = event => {
    const { dispatch, signer } = this.props
    const { config } = signer
    let keystoreDir = event.target.value
    if (event.target.files) {
      keystoreDir = event.target.files
    }
    const newConfig = { ...config, keystoreDir }
    dispatch(setConfig({ config: newConfig }))
  }

  handleChangeHost = event => {
    const { signer, dispatch } = this.props
    const { config } = signer
    const host = event.target.value
    const newConfig = { ...config, host }
    dispatch(setConfig({ config: newConfig }))
  }

  handleChangePort = event => {
    const { signer, dispatch } = this.props
    const { config } = signer
    const port = Number(event.target.value)
    const newConfig = { ...config, port }
    dispatch(setConfig({ config: newConfig }))
  }

  capitalizeLabel = label => label.charAt(0).toUpperCase() + label.slice(1)

  isRunning = () => {
    const { signer } = this.props
    return ['STARTING', 'STARTED', 'CONNECTED'].includes(signer.state)
  }

  browseKeystoreDir = async event => {
    // If we don't have openFolderDialog from Grid,
    // return true to continue with native file dialog
    if (!openFolderDialog) {
      return true
    }
    event.preventDefault()
    const { signer } = this.props
    const { config } = signer
    const { keystoreDir } = config
    const defaultPath = keystoreDir
    const dir = await openFolderDialog(defaultPath)
    this.handleChangeDataDir({ target: { value: dir } })
    return null
  }

  renderRpcHost() {
    const { signer } = this.props
    const { config } = signer
    const { rpcHost } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Host"
        value={rpcHost}
        onChange={this.handleChangeHost}
        disabled={this.isRunning()}
        fullWidth
      />
    )
  }

  renderRpcPort() {
    const { signer } = this.props
    const { config } = signer
    const { rpcPort } = config
    return (
      <TextField
        variant="outlined"
        label="RPC Port"
        value={rpcPort}
        onChange={this.handleChangePort}
        disabled={this.isRunning()}
        fullWidth
      />
    )
  }

  renderKeystoreDir() {
    const { signer } = this.props
    const { config } = signer
    const { keystoreDir } = config
    return (
      <div>
        <TextField
          variant="outlined"
          label="Keystore Directory"
          value={keystoreDir}
          onChange={this.handleChangeKeystoreDir}
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
          onChange={this.handleChangeKeystoreDir}
          onClick={this.browseKeystoreDir}
          ref={this.inputOpenFileRef}
          style={{ display: 'none' }}
        />
      </div>
    )
  }

  renderVersion() {
    const { release } = this.props
    if (!release || !release.version) {
      return null
    }
    return (
      <TextField
        variant="outlined"
        label="Version"
        value={release.version}
        disabled
        fullWidth
      />
    )
  }

  renderForm() {
    return (
      <MuiGrid container style={{ paddingTop: 15 }} spacing={24}>
        <MuiGrid item xs={6}>
          {this.renderKeystoreDir()}
        </MuiGrid>
        <MuiGrid item xs={6}>
          {this.renderVersion()}
        </MuiGrid>
        <MuiGrid item xs={6}>
          {this.renderRpcHost()}
        </MuiGrid>
        <MuiGrid item xs={6}>
          {this.renderRpcPort()}
        </MuiGrid>
      </MuiGrid>
    )
  }

  render() {
    return <div>{this.renderForm()}</div>
  }
}

function mapStateToProps(state) {
  return { signer: state.signer }
}

export default connect(mapStateToProps)(ConfigForm)
