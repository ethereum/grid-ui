import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { composeWithDevTools } from 'remote-redux-devtools'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

const persistConfig = {
  key: 'root',
  storage
}

// In development, send Redux actions to a local DevTools server
// Note: run and view these DevTools with `yarn dev:tools`
let debugWrapper = data => data
if (process.env.NODE_ENV === 'development') {
  debugWrapper = composeWithDevTools({
    realtime: true,
    port: 8000,
    maxAge: 100
  })
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default function configureStore() {
  const store = createStore(
    persistedReducer,
    debugWrapper(applyMiddleware(thunk))
  )
  const persistor = persistStore(store)

  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const nextRootReducer = require('./rootReducer').default // eslint-disable-line
      store.replaceReducer(persistReducer(persistConfig, nextRootReducer))
    })
  }

  return { store, persistor }
}
