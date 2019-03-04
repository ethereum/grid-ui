// import {Helpers} from './Helpers'
// export default Helpers.isMist() ? window.store.getState().nodes : window.store
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

// import Web3 from 'web3'
// let Ganache = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
// var web3 = new Web3(Ganache);
// const web3Remote = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/mist'));
/*
  ethereum: {
    http: {
      Main: 'https://mainnet.infura.io/mist',
      Ropsten: 'https://ropsten.infura.io/mist',
      Rinkeby: 'https://rinkeby.infura.io/mist',
      Kovan: 'https://kovan.infura.io/mist'
    },
    websockets: {
      Main: 'wss://mainnet.infura.io/ws/mist',
      Ropsten: 'wss://ropsten.infura.io/ws/mist',
      Rinkeby: 'wss://rinkeby.infura.io/ws/mist',
      Kovan: 'wss://kovan.infura.io/ws/mist'
    }
  },
  ipfs: {
    gateway: 'https://ipfs.infura.io',
    rpc: 'https://ipfs.infura.io:5001'
  }
  const web3Remote = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/mist'));

(async function fetchAccounts(){
  let _accounts = await web3.eth.getAccounts()
  _accounts.forEach(async (acc) => {
    //let balance = await web3Remote.eth.getBalance(acc)
    let balance = await web3.eth.getBalance(acc)
    store.dispatch({
      type: 'ADD_ACCOUNT',
      payload: {
        address: acc,
        balance: balance
      }
    })
  })
  console.log('received accounts', _accounts)
})()
*/

// let txCount = 0//await web3.eth.getTransactionCount(accounts[0])
const tx = {
  // "nonce": txCount,
  // "from": '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
  // "to": '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
  // "gas": "0x76c0", // 30400
  // "data": '',
  // "gasPrice": "0x9184e72a000", // 10000000000000
  // "value": "1000000000000000000" //web3Local.utils.toWei('1.0', 'ether')
}

const mockTabs = [
  {
    _id: 'browser',
    url: 'https://www.stateofthedapps.com',
    redirect: 'https://www.stateofthedapps.com',
    position: 0
  },
  {
    _id: '2',
    url: 'http://www.ethereum.org',
    redirect: 'http://www.ethereum.org',
    position: 2
  },
  {
    _id: '3',
    url: 'https://github.com/ethereum/mist-ui-react',
    redirect: 'http://www.github.com/philipplgh/mist-react-ui',
    position: 3
  },
  {
    _id: '4',
    url: 'http://www.example.com',
    redirect: 'http://www.example.com',
    position: 4
  }
].map(tab => {
  return { ...tab, id: tab._id }
})
// let tabs = Tabs.array.sort(el => el.position)

const suggestedDapps = [
  {
    name: 'Crypto Kitties',
    banner: 'https://www.cryptokitties.co/images/kitty-eth.svg',
    description:
      'Lorem Ipsum dolor amet sun Lorem Ipsum dolor amet sun Lorem Ipsum dolor amet sun',
    url: 'https://www.cryptokitties.co/'
  }
]

const initialState = {
  newTx: null, // tx //required by SendTx popup
  txs: [tx], // required by TxHistory popup

  tabs: mockTabs,
  suggestedDapps,

  accounts: [],

  nodes: {
    active: 'local',
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
    etherPriceUSD: '16',
    browser: {
      whitelist: 'enabled'
    }
  }
}

/* eslint-disable */
function mistApp(state = initialState, action) {
  let newState = Object.assign({}, state)
  switch (action.type) {
    case '[NODE]:LOCAL:UPDATE_NEW_BLOCK':
      console.log(action.type, action.payload)
      const { blockNumber, timestamp } = action.payload
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          local: {
            ...state.nodes.local,
            blockNumber,
            timestamp
          }
        }
      }
      console.log(newState.nodes)
      return newState
    case '[NODE]:LOCAL:UPDATE_SYNCING':
      const { startingBlock, currentBlock, highestBlock } = action.payload
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          local: {
            ...state.nodes.local,
            sync: {
              ...state.nodes.local.sync,
              startingBlock,
              currentBlock,
              highestBlock,
              knownStates,
              pulledStates
            }
          }
        }
      }
      return newState
    case '[NODE]:LOCAL:UPDATE_NETWORK':
      const { network } = action.payload
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          network
        }
      }
      return newState
    case '[NODE]:LOCAL:UPDATE_SYNC_MODE':
      const { syncMode } = action.payload
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          syncMode
        }
      }
      return newState
    case '[NODE]:LOCAL:UPDATE_PEER_COUNT':
      const { connectedPeers } = action.payload
      newState = {
        ...state,
        nodes: {
          ...state.nodes,
          local: {
            ...state.nodes.local,
            sync: {
              ...state.nodes.local.sync,
              connectedPeers
            }
          }
        }
      }
      return newState
    case 'SET_LOCAL_PEERCOUNT':
      newState.nodes.local.sync.connectedPeers = action.payload
      return newState
    case 'SET_REMOTE_BLOCK': {
      const blockHeader = action.payload
      newState.nodes.remote.blockNumber = blockHeader.number
      newState.nodes.remote.timestamp = blockHeader.timestamp
      return newState
    }
    case 'ADD_TAB': {
      const tab = action.payload
      const tabs = [...state.tabs, tab]
      newState.tabs = tabs
      return newState
    }
    case 'ADD_ACCOUNT': {
      const acc = action.payload
      const accounts = [...state.accounts, acc]
      newState.accounts = accounts
      return newState
    }
    case 'SET_TX': {
      const tx = action.payload
      newState.newTx = tx
      return newState
    }
    case 'EDIT_TAB': {
      /*
      const newState = Object.assign({}, state)
      const tab = action.payload
      const tabs = [...state.tabs] // copy tabs state
      const tabIdx = tabs.findIndex(t => (t.id === tab.id)) // find changed item
      const tabM = {
        ...tabs[tabIdx], // create copy of changed item
        icon: icon // & modify copy
      }
      tabs[tabIdx] = tabM // write changes to new tabs state
      return { tabs }
      */
      break
    }
    default:
      return state
  }
}
/* eslint-enable */

const store = createStore(mistApp, applyMiddleware(ReduxThunk))

export default store
