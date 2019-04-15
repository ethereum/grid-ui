import { Grid } from '../../API'
import {
  clefStarting,
  clefStarted,
  clefConnected,
  clefDisconnected,
  clefStopping,
  clefStopped,
  clefError,
  addRequest,
  selectRequest,
  requestDone,
  addNotification
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
  constructor() {
    this.nextRpcId = 0
  }

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

  sendClef(message, dispatch) {
    const { result, method, params, id } = message
    const jsonrpcMessage = { jsonrpc: '2.0', id }
    if (!id) {
      jsonrpcMessage.id = this.nextRpcId
      this.nextRpcId += 1
    }
    if (result) {
      jsonrpcMessage.result = result
    } else if (method) {
      jsonrpcMessage.method = method
      jsonrpcMessage.params = params || []
    }
    clef.send(jsonrpcMessage)
    dispatch(requestDone({ id: jsonrpcMessage.id }))
  }

  sendSigner(data, config) {
    const { rpcHost, rpcPort } = config
    const address = `http://${rpcHost}:${rpcPort}`
    const body = JSON.stringify(data)
    fetch(address, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      method: 'POST',
      body
    })
  }

  updateChainId(chainId) {
    this.sendClef({ method: 'clef_setChainId', params: [chainId] })
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
    clef.on('approveTx', data => this.approveTx(data, dispatch))
    clef.on('approveSignData', data => this.approveSignData(data, dispatch))
    clef.on('approveListing', data => this.approveListing(data, dispatch))
    clef.on('approveNewAccount', data => this.approveNewAccount(data, dispatch))
    clef.on('showInfo', data => this.showInfo(data, dispatch))
    clef.on('showError', data => this.showError(data, dispatch))
    clef.on('onApprovedTx', data => this.onApprovedTx(data, dispatch))
    clef.on('onSignerStartup', data => this.onSignerStartup(data, dispatch))
    clef.on('onInputRequired', data => this.onInputRequired(data, dispatch))
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
    // dispatch(clefConnected())
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

  approveTx(data, dispatch) {
    dispatch(addRequest({ data }))
    console.log('Transaction Signing is awaiting review.')
  }

  approveSignData(data, dispatch) {
    dispatch(addRequest({ data }))
    console.log('Message signing is awaiting review.')
  }

  approveListing(data, dispatch) {
    dispatch(addRequest({ data }))
    console.log('Account listing is awaiting review.')
  }

  approveNewAccount(data, dispatch) {
    dispatch(addRequest({ data }))
    console.log('New account request is awaiting review.')
  }

  showInfo(data, dispatch) {
    const { text } = data.params[0]
    dispatch(addNotification({ type: 'info', text }))
  }

  showError(data, dispatch) {
    const { text } = data.params[0]
    dispatch(addNotification({ type: 'error', text }))
  }

  onApprovedTx(data, dispatch) {
    console.log('Signed: ', data)
  }

  onSignerStartup(data, dispatch) {
    dispatch(clefConnected())
    console.log(
      `Clef is up.\n
      Web: ${data.params[0].info.extapi_http}\n
      IPC: ${data.params[0].info.extapi_ipc}`
    )
  }

  onInputRequired(data, dispatch) {
    dispatch(addRequest({ data }))
    console.log('Input required: ', data.params[0].title, data.params[0].prompt)
  }
}

export default new ClefService()
