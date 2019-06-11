import omit from 'lodash/omit'
import { combineReducers } from 'redux'
import { createTransform, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import client, { initialClientState } from './client/reducer'

const pluginTransform = createTransform((inboundState, key) => {
  if (key === 'client') {
    const persistablePluginData = { selected: inboundState.selected }

    const plugins = Object.keys(omit(inboundState, 'selected'))
    plugins.forEach(plugin => {
      persistablePluginData[plugin] = {
        ...initialClientState,
        config: inboundState[plugin].config
      }
    })

    return persistablePluginData
  }

  return inboundState
})

const rootPersistConfig = {
  key: 'root',
  storage,
  transforms: [pluginTransform]
}

const rootReducer = combineReducers({
  client
})

export default persistReducer(rootPersistConfig, rootReducer)
