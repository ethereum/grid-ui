export const initClient = clientData => {
  return {
    type: 'CLIENT:INIT',
    payload: { clientName: clientData.name, clientData }
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

export const setConfig = config => {
  return { type: 'CLIENT:SET_CONFIG', payload: { config } }
}

export function onConnectionUpdate(clientName, status) {
  return { type: 'CLIENT:STATUS_UPDATE', payload: { clientName, status } }
}

export const clientError = error => {
  return { type: 'CLIENT:ERROR', error }
}

function createListeners(client, dispatch) {
  client.on('starting', () => dispatch(onConnectionUpdate('STARTING')))
  client.on('started', () => dispatch(onConnectionUpdate('STARTED')))
  client.on('connected', () => dispatch(onConnectionUpdate('CONNECTED')))
  client.on('stopping', () => dispatch(onConnectionUpdate('STOPPING')))
  client.on('stopped', () => dispatch(onConnectionUpdate('STOPPED')))
  client.on('disconnect', () => dispatch(onConnectionUpdate('DISCONNETED')))
  client.on('error', e => dispatch(clientError(e)))
}

function removeListeners(client) {
  client.removeAllListeners('starting')
  client.removeAllListeners('started')
  client.removeAllListeners('connected')
  client.removeAllListeners('stopping')
  client.removeAllListeners('stopped')
  client.removeAllListeners('disconnect')
  client.removeAllListeners('error')
}

export const startClient = (client, release, config) => {
  return dispatch => {
    try {
      createListeners(client, dispatch)
      client.start(release, config)
      return dispatch({
        type: 'CLIENT:START',
        payload: { clientName: client.name, version: release.version, config }
      })
    } catch (e) {
      return dispatch({ type: 'CLIENT:START:ERROR', error: e.toString() })
    }
  }
}

export const stopClient = client => {
  return dispatch => {
    try {
      client.stop()
      removeListeners(client)
      dispatch({ type: 'CLIENT:STOP' })
    } catch (e) {
      dispatch({ type: 'CLIENT:STOP:ERROR', error: e.toString() })
    }
  }
}

export const toggleClient = (client, release, config) => {
  return async dispatch => {
    try {
      if (client.isRunning) {
        return dispatch(stopClient(client))
      }
      return dispatch(startClient(client, release, config))
    } catch (e) {
      return { type: 'CLIENT:TOGGLE:ERROR', error: e.toString() }
    }
  }
}
