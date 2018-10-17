// export default Helpers.isMist() ? window.store.getState().nodes : window.store
const{ createStore, applyMiddleware } = require('redux');
const ReduxThunk = require('redux-thunk')

const initialState = require('./InitialState')

/*
const  Web3 = require('web3')
let Ganache = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
var web3 = new Web3(Ganache);
//const web3Remote = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/mist'));
*/
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
*/
// const web3Remote = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/mist'));

/*
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
    case 'ADD_TAB': {
      let newState = Object.assign({}, state)
      let tab = action.payload
      let tabs = [...state.tabs, tab]
      newState.tabs = tabs
      return newState
    }
    case 'ADD_ACCOUNT':{
      console.log('reducer called: add account')
      let newState = Object.assign({}, state)
      let acc = action.payload
      let accounts = [...state.accounts, acc]
      newState.accounts = accounts
      return newState
    }
    case 'SET_TX':{
      let newState = Object.assign({}, state)
      let tx = action.payload
      newState.newTx = tx
      return newState
    }
    case 'EDIT_TAB': {
      /*
           let newState = Object.assign({}, state)
      let tab = action.payload
      let tabs = [...state.tabs] // copy tabs state
      let tabIdx = tabs.findIndex(t => (t.id === tab.id)) // find changed item
      let tabM = {
        ...tabs[tabIdx], // create copy of changed item
        icon: icon // & modify copy
      } 
      tabs[tabIdx] = tabM // write changes to new tabs state
      return {
        tabs: tabs 
      }
      */
    }
    default:
      return state
  }
}
const store = createStore(mistApp/*, applyMiddleware(ReduxThunk)*/)

let _accounts = [ 
  '0xF5A5d5c30BfAC14bf207b6396861aA471F9A711D',
  '0xdf4B9dA0aef26bEE9d55Db34480C722906DB4b02',
  '0x944C8763B920fA7a94780B58e78A76Abc87f7cA8',
  '0x6564Bcf22912e98960Aa5af5078f4D6f0c01306B',
  '0x72317406A02435D967111B190DedB7aecD5c24E1',
  '0x4a296FBaB50050BDace36500a96251F3630d3EC6',
  '0xb9120Dd975bF62152CF96C474470E96FaF09D094',
  '0xe32e6b95957cbDfe668355F11b3EafAA1b537de7',
  '0x7b14F76f22B4eC6c3D44a8AB962C31ed5d900aBd',
  '0x19BAe22A399E1bFEE0B10419D006E8d112C51e5b',
  '0x969912D664477bf4Db7B1Aae743D7BbC3Aa59594',
  '0x5793b3709ecdFBBa3019F4a16DC0346aaa20eFE7',
  '0x73159c2F51Cc5fa273886Ea047E96C81CC2dBBCE' 
]
_accounts.forEach((acc) => {
    //let balance = await web3Remote.eth.getBalance(acc)
    let balance = 0
    store.dispatch({
      type: 'ADD_ACCOUNT',
      payload: {
        address: acc,
        balance: ('' +balance)
      }
    })
  })

module.exports = store
