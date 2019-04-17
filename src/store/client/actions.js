import Geth from './gethService'

export const initGeth = () => {
  return async dispatch => {
    const status = await Geth.getState()
    const isRunning = await Geth.isRunning(status)

    if (isRunning) {
      Geth.resume(dispatch)
    }

    return dispatch({
      type: '[CLIENT]:GETH:INIT',
      payload: { status }
    })
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

export const gethStarting = () => {
  return { type: '[CLIENT]:GETH:STARTING' }
}

export const gethStarted = () => {
  return { type: '[CLIENT]:GETH:STARTED' }
}

export const gethConnected = () => {
  return { type: '[CLIENT]:GETH:CONNECTED' }
}

export const gethDisconnected = () => {
  return { type: '[CLIENT]:GETH:DISCONNECTED' }
}

export const gethStopping = () => {
  return { type: '[CLIENT]:GETH:STOPPING' }
}

export const gethStopped = () => {
  return { type: '[CLIENT]:GETH:STOPPED' }
}

export const gethError = ({ error }) => {
  return { type: '[CLIENT]:GETH:ERROR', error }
}

export const setRelease = release => {
  return {
    type: 'CLIENT:SET_RELEASE',
    payload: { release }
  }
}

export const startGeth = () => {
  return (dispatch, getState) => {
    const { client } = getState()
    const { config } = client

    try {
      Geth.start(config, dispatch)
      return { type: '[CLIENT]:GETH:START', payload: { config } }
    } catch (e) {
      return { type: '[CLIENT]:GETH:START:ERROR', error: e.toString() }
    }
  }
}

export const stopGeth = () => {
  return dispatch => {
    try {
      Geth.stop()
      dispatch({ type: '[CLIENT]:GETH:STOP' })
    } catch (e) {
      dispatch({ type: '[CLIENT]:GETH:STOP:ERROR', error: e.toString() })
    }
  }
}

export const toggleGeth = () => {
  return async (dispatch, getState) => {
    const { client } = getState()
    const isRunning = await Geth.isRunning(client.state)

    try {
      if (isRunning) {
        return dispatch(stopGeth())
      }
      return dispatch(startGeth())
    } catch (e) {
      return { type: '[CLIENT]:GETH:TOGGLE:ERROR', error: e.toString() }
    }
  }
}

export const setConfig = ({ config }) => {
  Geth.setConfig(config)

  return {
    type: '[CLIENT]:GETH:SET_CONFIG',
    payload: { config }
  }
}

export const clearError = () => {
  return {
    type: '[CLIENT]:GETH:CLEAR_ERROR'
  }
}

export const selectClient = clientData => {
  return { type: 'CLIENT:SELECT', payload: { clientData } }
}
