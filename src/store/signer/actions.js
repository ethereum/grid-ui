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
