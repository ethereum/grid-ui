// export default Helpers.isMist() ? window.store.getState().nodes : window.store
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import ipc from './Ipc'

const initialState = ipc.sendSync('store:get-state-sync')

function mistApp(state = initialState, action) {
  return state
}
const store = createStore(mistApp, applyMiddleware(ReduxThunk))

export default store