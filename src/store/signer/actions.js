import Clef from './clefService'

export const clefStarting = () => {
  return { type: '[SIGNER]:CLEF:STARTING' }
}

export const clefStarted = () => {
  return { type: '[SIGNER]:CLEF:STARTED' }
}

export const clefConnected = () => {
  return { type: '[SIGNER]:CLEF:CONNECTED' }
}

export const clefDisconnected = () => {
  return { type: '[SIGNER]:CLEF:DISCONNECTED' }
}

export const clefStopping = () => {
  return { type: '[SIGNER]:CLEF:STOPPING' }
}

export const clefStopped = () => {
  return { type: '[SIGNER]:CLEF:STOPPED' }
}

export const clefError = ({ error }) => {
  return {
    type: '[SIGNER]:CLEF:ERROR',
    payload: { error }
  }
}

export const clearError = () => {
  return {
    type: '[SIGNER]:CLEF:CLEAR_ERROR'
  }
}

export const setConfig = ({ config }) => {
  return async (dispatch, getState) => {
    const { client } = getState()
    const { config: clientConfig } = client
    const { network } = clientConfig
    Clef.setConfig(config, network)

    dispatch({
      type: '[SIGNER]:CLEF:SET_CONFIG',
      payload: { config }
    })
  }
}

export const selectRequest = ({ index }) => {
  return {
    type: '[SIGNER]:CLEF:SELECT_REQUEST',
    payload: { index }
  }
}

export const addRequest = ({ data }) => {
  return async (dispatch, getState) => {
    const request = data
    // Remove unneeded jsonrpc value
    // if (request.jsonrpc) {
    //   delete request.jsonrpc
    // }
    dispatch({
      type: '[SIGNER]:CLEF:ADD_REQUEST',
      payload: { request }
    })
    const { selectedRequest } = getState().signer
    if (!selectedRequest) {
      dispatch(selectRequest({ index: 0 }))
    }
  }
}

export const requestDone = ({ id }) => {
  return async (dispatch, getState) => {
    const { signer } = getState()
    const { requests, selectedRequest } = signer
    let nextSelected = selectedRequest
    if (nextSelected > requests.length - 2) {
      nextSelected = requests.length - 3
    }
    dispatch({
      type: '[SIGNER]:CLEF:REQUEST_DONE',
      payload: { doneId: id, nextSelected }
    })
  }
}

export const addNotification = ({ type, text }) => {
  return {
    type: '[SIGNER]:CLEF:ADD_NOTIFICATION',
    payload: { type, text }
  }
}

export const clearNotification = ({ index }) => {
  return {
    type: '[SIGNER]:CLEF:CLEAR_NOTIFICATION',
    payload: { index }
  }
}
