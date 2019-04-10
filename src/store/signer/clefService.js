import { Grid } from '../../API'
import {
  clefStarting,
  clefStarted,
  clefConnected,
  clefDisconnected,
  clefStopping,
  clefStopped,
  clefError
} from './actions'

const { clef } = Grid

// Constants
const STATES = {
  STARTING: 'STARTING' /* About to be started */,
  STARTED: 'STARTED' /* Started */,
  CONNECTED: 'CONNECTED' /* HTTP endpoint opened - all ready */,
  STOPPING: 'STOPPING' /* About to be stopped */,
  STOPPED: 'STOPPED' /* Stopped */,
  ERROR: 'ERROR' /* Unexpected error */
}

// Helpers
const networkToChainId = network => {
  switch (network.toLowerCase()) {
    case 'main':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'goerli':
      return 5
    case 'kovan':
      return 42
    case 'private':
      return 1337
    default:
      throw new Error('Unsupported Network: ', network)
  }
}

class ClefService {
  setConfig(config, network) {
    const newConfig = config
    // Set chainId
    newConfig.chainId = networkToChainId(network)
    clef.setConfig(newConfig)
  }

  getConfig() {
    const config = clef.getConfig()
    // Remove unneeded chainId
    delete config.chainId
    return config
  }

  start(dispatch) {
    clef.start()
    this.createListeners(dispatch)
  }

  stop(dispatch) {
    clef.stop()
    dispatch(clefStopped())
    this.removeListeners()
  }

  isRunning(state) {
    return [STATES.STARTING, STATES.STARTED, STATES.CONNECTED].includes(state)
  }

  getState() {
    return clef.state
  }

  createListeners(dispatch) {
    // State
    clef.on('starting', () => this.onStarting(dispatch))
    clef.on('started', () => this.onStarted(dispatch))
    clef.on('connect', () => this.onConnect(dispatch))
    clef.on('stopping', () => this.onStopping(dispatch))
    clef.on('stopped', () => this.onStopped(dispatch))
    clef.on('disconnect', () => this.onDisconnect(dispatch))
    clef.on('error', e => this.onError(e, dispatch))
    // Signer events
    clef.on('approveTx', this.approveTx.bind(this))
    clef.on('approveSignData', this.approveSignData.bind(this))
    clef.on('approveListing', this.approveListing.bind(this))
    clef.on('approveNewAccount', this.approveNewAccount.bind(this))
    clef.on('showInfo', this.showInfo.bind(this))
    clef.on('showError', this.showError.bind(this))
    clef.on('onApprovedTx', this.onApprovedTx.bind(this))
    clef.on('onSignerStartup', this.onSignerStartup.bind(this))
    clef.on('onInputRequired', this.onInputRequired.bind(this))
  }

  removeListeners() {
    // State
    clef.removeListener('starting', this.onStarting)
    clef.removeListener('started', this.onStarted)
    clef.removeListener('connect', this.onConnect)
    clef.removeListener('stopping', this.onStopping)
    clef.removeListener('stopped', this.onStopped)
    clef.removeListener('disconnect', this.onDisconnect)
    clef.removeListener('error', this.onError)
    // Signer events
    clef.removeListener('approveTx', this.approveTx)
    clef.removeListener('approveSignData', this.approveSignData)
    clef.removeListener('approveListing', this.approveListing)
    clef.removeListener('approveNewAccount', this.approveNewAccount)
    clef.removeListener('showInfo', this.showInfo)
    clef.removeListener('showError', this.showError)
    clef.removeListener('onApprovedTx', this.onApprovedTx)
    clef.removeListener('onSignerStartup', this.onSignerStartup)
    clef.removeListener('onInputRequired', this.onInputRequired)
  }

  onStarting(dispatch) {
    dispatch(clefStarting())
  }

  onStarted(dispatch) {
    dispatch(clefStarted())
  }

  onConnect(dispatch) {
    dispatch(clefConnected())
  }

  onDisconnect(dispatch) {
    dispatch(clefDisconnected())
  }

  onStopping(dispatch) {
    dispatch(clefStopping())
  }

  onStopped(dispatch) {
    dispatch(clefStopped())
  }

  onError(error, dispatch) {
    dispatch(clefError({ error }))
  }

  approveTx() {}

  approveSignData() {}

  approveListing() {}

  approveNewAccount() {}

  showInfo() {}

  showError() {}

  onApprovedTx() {}

  onSignerStartup() {}

  onInputRequired() {}
}

export default new ClefService()
