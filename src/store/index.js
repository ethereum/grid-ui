import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

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

export default function configureReduxStore() {
  return createStore(rootReducer, debugWrapper(applyMiddleware(thunk)))
}
