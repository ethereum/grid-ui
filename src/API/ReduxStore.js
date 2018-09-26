import {Helpers} from './Helpers'
// export default Helpers.isMist() ? window.store.getState().nodes : window.store
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'


let accounts = [
  '0xF5A5d5c30BfAC14bf207b6396861aA471F9A711D',
  '0xdf4B9dA0aef26bEE9d55Db34480C722906DB4b02'
]
console.log('web3 accounts: ', accounts)

let txCount = 0//await web3.eth.getTransactionCount(accounts[0])
let tx = {
  "nonce": txCount,
  "from": accounts[0],
  "to": accounts[1],
  "gas": "0x76c0", // 30400
  "data": '',
  //"gasPrice": "0x9184e72a000", // 10000000000000
  "value": "1000000000000000000" //web3Local.utils.toWei('1.0', 'ether')
}

const initialState = {

  newTx: tx, //required by SendTx popup
  txs: [tx], //required by TxHistory popup
  
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

/*
    /*
    
      dappAccounts: function() {
    if (this.permissions) {
      return EthAccounts.find({
        address: { $in: this.permissions.accounts || [] }
      });
    }
  },
    /
   let dappAccountsTest = [
    {
      address: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'
    },
    {
      address: '0x554f8e6938004575bd89cbef417aea5c18140d92'
    }
  ]
*/

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
