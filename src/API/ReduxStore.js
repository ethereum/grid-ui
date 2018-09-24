import {Helpers} from './Helpers'
// export default Helpers.isMist() ? window.store.getState().nodes : window.store
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'

const initialState = {

  // newTx: tx, //required by SendTx popup
  // txs: [tx], //required by TxHistory popup
  
  nodes: {
    active: 'remote',
    network: 'main',
    changingNetwork: false,
    remote: {
      client: 'infura',
      blockNumber: 100, // if < 1000 NodeInfo will display "connecting.."
      timestamp: 0
    },
    local: {
      client: 'geth',
      blockNumber: 1,
      timestamp: 0,
      syncMode: 'fast',
      sync: {
        connectedPeers: 0,
        currentBlock: 0,
        highestBlock: 0,
        knownStates: 0,
        pulledStates: 0,
        startingBlock: 0
      }
    }
  },

  settings: {
    etherPriceUSD: '16'
  }

}

function mistApp(state = initialState, action) {
  // For now, don't handle any actions
  // and just return the state given to us.
  switch (action.type) {
    case 'SET_LOCAL_PEERCOUNT':
      let newState = Object.assign({}, state)
      newState.nodes.local.sync.connectedPeers = action.payload
      return newState
    case 'SET_REMOTE_BLOCK': {
      let newState = Object.assign({}, state)
      let blockHeader = action.payload
      newState.nodes.remote.blockNumber = blockHeader.number
      newState.nodes.remote.timestamp = blockHeader.timestamp
      return newState
    }
    default:
      return state
  }
}
const store = createStore(mistApp, applyMiddleware(ReduxThunk))

export default store
