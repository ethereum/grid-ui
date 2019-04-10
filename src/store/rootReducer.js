import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import clientReducer from './client/reducer'
import signerReducer from './signer/reducer'

const rootPersistConfig = {
  key: 'root',
  storage,
  blacklist: ['client', 'signer']
}

const clientPersistConfig = {
  key: 'client',
  storage,
  whitelist: ['config', 'release']
}

const signerPersistConfig = {
  key: 'signer',
  storage,
  whitelist: ['config', 'accounts']
}

const rootReducer = combineReducers({
  client: persistReducer(clientPersistConfig, clientReducer),
  signer: persistReducer(signerPersistConfig, signerReducer)
})

export default persistReducer(rootPersistConfig, rootReducer)
