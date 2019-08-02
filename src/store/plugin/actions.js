import PluginService from './pluginService'
import {
  getPersistedClientSettings,
  getPersistedFlags,
  getDefaultSetting,
  getPluginSettingsConfig,
  getSettingsIds
} from '../../lib/utils'
import { generateFlags } from '../../lib/flags'

export const onConnectionUpdate = (clientName, status) => {
  return { type: 'PLUGIN:STATUS_UPDATE', payload: { clientName, status } }
}

const buildClientDefaults = client => {
  const pluginDefaults = {}
  const settingsIds = getSettingsIds(client)

  // Handle rehydration: if config.json has settings already, use them.
  const persistedSettings = getPersistedClientSettings(client.name)
  if (settingsIds.length && persistedSettings) {
    if (Object.keys(persistedSettings).length) {
      settingsIds.forEach(id => {
        pluginDefaults[id] =
          persistedSettings[id] || getDefaultSetting(client, id)
      })
      return pluginDefaults
    }
  }

  const clientSettings = getPluginSettingsConfig(client)
  clientSettings.forEach(setting => {
    if ('default' in setting) {
      pluginDefaults[setting.id] = setting.default
    }
  })

  return pluginDefaults
}

export const getGeneratedFlags = (client, config) => {
  const settings = getPluginSettingsConfig(client)
  const flags = generateFlags(config, settings)
  return flags
}

export const initClient = client => {
  return dispatch => {
    const config = buildClientDefaults(client)
    const clientData = client.plugin.config
    const flags =
      getPersistedFlags(client.name) || getGeneratedFlags(client, config)
    const release = client.plugin.getSelectedRelease()

    dispatch({
      type: 'PLUGIN:INIT',
      payload: {
        clientName: clientData.name,
        type: client.type,
        clientData,
        config,
        flags,
        release
      }
    })

    console.log('Creating listeners for', client.name)
    PluginService.createListeners(client, dispatch)

    if (client.isRunning) {
      console.log('Resuming', client.name)
      PluginService.resume(client, dispatch)
    }
  }
}

export const newBlock = (clientName, blockNumber, timestamp) => {
  return {
    type: 'PLUGIN:UPDATE_NEW_BLOCK',
    payload: { clientName, blockNumber, timestamp }
  }
}

export const updateSyncing = (
  clientName,
  { startingBlock, currentBlock, highestBlock, knownStates, pulledStates }
) => {
  return {
    type: 'PLUGIN:UPDATE_SYNCING',
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
    if (peerCount !== getState().plugin[clientName].active.peerCount) {
      dispatch({
        type: 'PLUGIN:UPDATE_PEER_COUNT',
        payload: { clientName, peerCount }
      })
    }
  }
}

export const updatePeerCountError = (clientName, message) => {
  return {
    type: 'PLUGIN:UPDATE_PEER_COUNT:ERROR',
    error: true,
    payload: { clientName, message }
  }
}

export const addPluginError = (clientName, error) => {
  return { type: 'PLUGIN:ERROR:ADD', error, payload: { clientName } }
}

export const clearError = (clientName, index) => {
  return {
    type: 'PLUGIN:CLEAR_ERROR',
    payload: { clientName, index }
  }
}

export const selectClient = (clientName, tab = 0) => {
  return { type: 'PLUGIN:SELECT', payload: { clientName, tab } }
}

export const selectTab = tab => {
  return { type: 'PLUGIN:SELECT_TAB', payload: { tab } }
}

export const setRelease = (client, release) => {
  client.plugin.setSelectedRelease(release)
  return {
    type: 'PLUGIN:SET_RELEASE',
    payload: { clientName: client.name, release }
  }
}

export const setFlags = (client, config) => {
  const clientName = client.name
  const flags = getGeneratedFlags(client, config)
  return { type: 'PLUGIN:SET_FLAGS', payload: { clientName, flags } }
}

export const setCustomFlags = (clientName, flags) => {
  return { type: 'PLUGIN:SET_FLAGS', payload: { clientName, flags } }
}

export const setConfig = (client, config) => {
  return dispatch => {
    const clientName = client.name
    dispatch({
      type: 'PLUGIN:SET_CONFIG',
      payload: { clientName, config }
    })
    dispatch(setFlags(client, config))
  }
}

export const startClient = (client, release) => {
  return (dispatch, getState) => {
    try {
      const { config, flags } = getState().plugin[client.name]
      PluginService.start(client, release, flags, config, dispatch)
      return dispatch({
        type: 'PLUGIN:START',
        payload: { clientName: client.name, version: release.version, config }
      })
    } catch (error) {
      return dispatch({ type: 'PLUGIN:START:ERROR', error: error.toString() })
    }
  }
}

export const stopClient = client => {
  return dispatch => {
    try {
      PluginService.stop(client)
      dispatch({ type: 'PLUGIN:STOP', payload: { clientName: client.name } })
    } catch (e) {
      dispatch({ type: 'PLUGIN:STOP:ERROR', error: e.toString() })
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
      return { type: 'PLUGIN:TOGGLE:ERROR', error: e.toString() }
    }
  }
}
