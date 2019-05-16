import {
  createRequestListeners,
  removeRequestListeners,
  clearRequests,
  clearRequestNotifications
} from '../requests/actions'
import {
  startClientSideEffects,
  stopClientSideEffects,
  setConfigSideEffects
} from './pluginSideEffects'

export const clientError = error => {
  return { type: 'CLIENT:ERROR', error }
}

export function onConnectionUpdate(clientName, status) {
  return { type: 'CLIENT:STATUS_UPDATE', payload: { clientName, status } }
}

function createPluginListeners(client, dispatch) {
  if (client.name === 'clef') {
    createRequestListeners(client, dispatch)
  }
}

function removePluginListeners(client) {
  if (client.name === 'clef') {
    removeRequestListeners(client)
  }
}

function createListeners(client, dispatch) {
  client.on('starting', () =>
    dispatch(onConnectionUpdate(client.name, 'STARTING'))
  )
  client.on('started', () =>
    dispatch(onConnectionUpdate(client.name, 'STARTED'))
  )
  client.on('connected', () =>
    dispatch(onConnectionUpdate(client.name, 'CONNECTED'))
  )
  client.on('stopping', () =>
    dispatch(onConnectionUpdate(client.name, 'STOPPING'))
  )
  client.on('stopped', () =>
    dispatch(onConnectionUpdate(client.name, 'STOPPED'))
  )
  client.on('disconnect', () =>
    dispatch(onConnectionUpdate(client.name, 'DISCONNETED'))
  )
  client.on('error', e => dispatch(clientError(e)))
  createPluginListeners(client, dispatch)
}

function removeListeners(client) {
  client.removeAllListeners('starting')
  client.removeAllListeners('started')
  client.removeAllListeners('connected')
  client.removeAllListeners('stopping')
  client.removeAllListeners('stopped')
  client.removeAllListeners('disconnect')
  client.removeAllListeners('error')
  removePluginListeners(client)
}

export const initClient = client => {
  return dispatch => {
    const clientData = client.plugin.config
    // TODO: finalize pattern for default configs
    const config = clientData.config ? clientData.config.default : {}
    dispatch({
      type: 'CLIENT:INIT',
      payload: {
        clientName: clientData.name,
        type: client.type,
        clientData,
        config
      }
    })

    if (client.isRunning) {
      createListeners(client, dispatch)
      dispatch(onConnectionUpdate(client.name, 'CONNECTED'))
    }
  }
}

export const newBlock = ({ blockNumber, timestamp }) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_NEW_BLOCK',
    payload: { blockNumber, timestamp }
  }
}

export const updateSyncing = ({
  startingBlock,
  currentBlock,
  highestBlock,
  knownStates,
  pulledStates
}) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_SYNCING',
    payload: {
      startingBlock,
      currentBlock,
      highestBlock,
      knownStates,
      pulledStates
    }
  }
}

export const updatePeerCount = ({ peerCount }) => {
  return (dispatch, getState) => {
    if (peerCount !== getState().client.peerCount) {
      dispatch({
        type: '[CLIENT]:GETH:UPDATE_PEER_COUNT',
        payload: { peerCount }
      })
    }
  }
}

export const updateNetwork = ({ network }) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_NETWORK',
    payload: { network }
  }
}

export const updateSyncMode = ({ syncMode }) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_SYNC_MODE',
    payload: { syncMode }
  }
}

export const clearError = () => {
  return {
    type: '[CLIENT]:GETH:CLEAR_ERROR'
  }
}

// TODO: finish refactor to generic client:

export const selectClient = clientName => {
  return { type: 'CLIENT:SELECT', payload: { clientName } }
}

export const setRelease = (clientName, release) => {
  return {
    type: 'CLIENT:SET_RELEASE',
    payload: { clientName, release }
  }
}

export const setConfig = (clientName, config) => {
  return dispatch => {
    dispatch({ type: 'CLIENT:SET_CONFIG', payload: { clientName, config } })
    dispatch(setConfigSideEffects(clientName, config))
  }
}

export const startClient = (client, release) => {
  return (dispatch, getState) => {
    try {
      const { config } = getState().client[client.name]
      createListeners(client, dispatch)
      client.start(release, config)
      dispatch({
        type: 'CLIENT:START',
        payload: { clientName: client.name, version: release.version, config }
      })
      dispatch(startClientSideEffects(client.name))
    } catch (e) {
      dispatch({ type: 'CLIENT:START:ERROR', error: e.toString() })
    }
  }
}

export const stopClient = client => {
  return dispatch => {
    try {
      client.stop()
      removeListeners(client)
      dispatch({ type: 'CLIENT:STOP', payload: { clientName: client.name } })
      dispatch(stopClientSideEffects(client.name))
      // Clear any pending requests and request notifications on stop
      dispatch(clearRequests(client))
      dispatch(clearRequestNotifications(client))
    } catch (e) {
      dispatch({ type: 'CLIENT:STOP:ERROR', error: e.toString() })
    }
  }
}

export const toggleClient = (client, release) => {
  return async dispatch => {
    try {
      if (client.isRunning) {
        return dispatch(stopClient(client))
      }
      return dispatch(startClient(client, release))
    } catch (e) {
      return { type: 'CLIENT:TOGGLE:ERROR', error: e.toString() }
    }
  }
}

export const updateConfigValue = (clientName, key, value) => {
  return (dispatch, getState) => {
    const client = getState().client[clientName]
    if (!client) {
      return
    }
    const { config } = client
    if (config[key] === value) {
      return
    }
    const newConfig = {
      ...config,
      [key]: value
    }
    dispatch(setConfig(clientName, newConfig))
  }
}
