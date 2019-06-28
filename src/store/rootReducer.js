import { combineReducers } from 'redux'
import client from './client/reducer'

const rootReducer = combineReducers({
  client
})

export default rootReducer
