import Clef from '../requests/clefService'
import { setConfig } from './actions'
import { networkToChainId } from '../../lib/utils'

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

export const startClientSideEffects = clientName => {
  return dispatch => {
    if (clientName === 'clef') {
      dispatch(updateConfigValue('geth', 'signer', 'clef'))
    }
  }
}

export const stopClientSideEffects = clientName => {
  return dispatch => {
    if (clientName === 'clef') {
      dispatch(updateConfigValue('geth', 'signer', 'none'))
    }
  }
}

function updateClefChainId(config) {
  return (dispatch, getState) => {
    const newChainId = networkToChainId(config.network)
    const { chainId: clefChainId } = getState().client.clef.config
    if (newChainId !== clefChainId) {
      Clef.updateChainId(dispatch, getState, newChainId)
    }
  }
}

export const setConfigSideEffects = (clientName, config) => {
  return (dispatch, getState) => {
    // Include side effects here that affect other clients
    if (clientName === 'geth') {
      if (getState().client.clef) {
        // Geth->Clef
        dispatch(updateClefChainId(config))
      }
    }
  }
}
