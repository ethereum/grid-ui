import {Helpers} from './Helpers'
// export default Helpers.isMist() ? window.store.getState().nodes : window.store
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'

const initialState = window.store
function mistApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  return state
}
const store = createStore(mistApp, applyMiddleware(ReduxThunk))
export default store
