import Clef from '../requests/clefService'
import { updateConfigValue } from './actions'
import { networkToChainId } from '../../lib/utils'

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
