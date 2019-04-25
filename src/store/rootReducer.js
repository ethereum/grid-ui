import { combineReducers } from 'redux'
// import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import clientReducer from './client/reducer'

// const rootPersistConfig = {
// key: 'root',
// storage,
// blacklist: ['client']
// }

// const clientPersistConfig = {
// key: 'client',
// storage,
// whitelist: ['config', 'release']
// }

const rootReducer = combineReducers({
  // client: persistReducer(clientPersistConfig, clientReducer)
  client: clientReducer
})

// export default persistReducer(rootPersistConfig, rootReducer)
export default rootReducer
