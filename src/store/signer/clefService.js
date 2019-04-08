import { Grid } from '../../API'
import { clefStarted, clefStopped } from './actions'

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

class ClefService {
  start(dispatch) {
    clef.start()
    dispatch(clefStarted())
    this.removeListeners()
  }

  stop(dispatch) {
    clef.stop()
    dispatch(clefStopped())
    this.createListeners()
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
}

export default new ClefService()
