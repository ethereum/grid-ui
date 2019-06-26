import ClientService from './clientService'
import { getPluginSettingsConfig } from '../../lib/utils'
import { generateFlags } from '../../lib/flags'

export const onConnectionUpdate = (clientName, status) => {
  return { type: 'CLIENT:STATUS_UPDATE', payload: { clientName, status } }
}

const buildClientDefaults = client => {
  const pluginDefaults = {}
  const clientSettings = getPluginSettingsConfig(client)
  clientSettings.forEach(setting => {
    if ('default' in setting) {
      pluginDefaults[setting.id] = setting.default
    }
  })
  return pluginDefaults
}

export const initClient = client => {
  return dispatch => {
    const clientData = client.plugin.config
    const config = buildClientDefaults(client)
    const flags = getGeneratedFlags(client, config)

    dispatch({
      type: 'CLIENT:INIT',
      payload: {
        clientName: clientData.name,
        type: client.type,
        clientData,
        config,
        flags
      }
    })

    if (client.isRunning) {
      ClientService.resume(client, dispatch)
    }
  }
}

export const newBlock = (clientName, blockNumber, timestamp) => {
  return {
    type: 'CLIENT:UPDATE_NEW_BLOCK',
    payload: { clientName, blockNumber, timestamp }
  }
}

export const updateSyncing = (
  clientName,
  { startingBlock, currentBlock, highestBlock, knownStates, pulledStates }
) => {
  return {
    type: 'CLIENT:UPDATE_SYNCING',
    payload: {
      clientName,
      startingBlock,
      currentBlock,
      highestBlock,
      knownStates,
      pulledStates
    }
  }
}

export const updatePeerCount = (clientName, peerCount) => {
  return (dispatch, getState) => {
    if (peerCount !== getState().client[clientName].active.peerCount) {
      dispatch({
        type: 'CLIENT:UPDATE_PEER_COUNT',
        payload: { clientName, peerCount }
      })
    }
  }
}

export const updatePeerCountError = (clientName, message) => {
  return {
    type: 'CLIENT:UPDATE_PEER_COUNT:ERROR',
    error: true,
    payload: { clientName, message }
  }
}

export const clientError = (clientName, error) => {
  return { type: 'CLIENT:ERROR', error, payload: { clientName } }
}

export const clearError = clientName => {
  return {
    type: 'CLIENT:CLEAR_ERROR',
    payload: { clientName }
  }
}

export const selectClient = clientName => {
  return { type: 'CLIENT:SELECT', payload: { clientName } }
}

export const setRelease = (clientName, release) => {
  return {
    type: 'CLIENT:SET_RELEASE',
    payload: { clientName, release }
  }
}

export const getGeneratedFlags = (client, config) => {
  const settings = getPluginSettingsConfig(client)
  const flags = generateFlags(config, settings)
  return flags
}

export const setFlags = (client, config) => {
  const clientName = client.name
  const flags = getGeneratedFlags(client, config)
  return { type: 'CLIENT:SET_FLAGS', payload: { clientName, flags } }
}

export const setCustomFlags = (clientName, flags) => {
  return { type: 'CLIENT:SET_FLAGS', payload: { clientName, flags } }
}

export const setConfig = (client, config) => {
  return dispatch => {
    const clientName = client.name
    dispatch({
      type: 'CLIENT:SET_CONFIG',
      payload: { clientName, config }
    })
    dispatch(setFlags(client, config))
  }
}

export const startClient = (client, release) => {
  return (dispatch, getState) => {
    try {
      const { config, flags } = getState().client[client.name]
      ClientService.start(client, release, flags, config, dispatch)
      return dispatch({
        type: 'CLIENT:START',
        payload: { clientName: client.name, version: release.version, config }
      })
    } catch (error) {
      return dispatch({ type: 'CLIENT:START:ERROR', error: error.toString() })
    }
  }
}

export const stopClient = client => {
  return dispatch => {
    try {
      ClientService.stop(client)
      dispatch({ type: 'CLIENT:STOP', payload: { clientName: client.name } })
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
