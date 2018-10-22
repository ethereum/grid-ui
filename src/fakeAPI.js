import {is} from './API/Helpers'
import CollectionLight from './lib/collection'
import store from './API/ReduxStore'

// avoid that the mock objects are overwritten
function seal (target, propName, obj) {
  Object.defineProperty(target, propName, {
    set: function(x) { },
    get: function (x) {
      // console.log('attempted get of', propName)
      return obj
    }
  });
}

function init(window, lang){

  const i18n = {
    t: (str) => {
      if (!lang) { return str}
      let parts = str.split('.')
      let cur = lang
      for(var i = 0; i < parts.length; i++) {
        cur = cur[parts[i]]
        if(!cur){ return str}
      }
      return cur
    }
  }


  var Web3 = require('web3');
  let Ganache = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545")
  var web3Local = new Web3(Ganache);
  const web3Remote = new Web3(new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws/mist'))

  window.web3 = web3Local

  //let web3 = window.web3
  /*
  const _web3 = {
    utils: {
      toBN: () => {
        return 100
      },
      isHex: () => {
        return true
      },
      hexToNumberString: (hex) => {
        return ''+hex
      }
    },
    eth: {
      net: {
        getPeerCount: () => {
          return new Promise((resolve, reject) => {
            if(web3){
              web3.net.getPeerCount((err, res)=>{
                if(err) return reject(err)
                resolve(res)
              })
            }
            resolve(99)
          });
        }
      }
    }
  }
  */

  const subscription = web3Remote.eth.subscribe('newBlockHeaders', (error, blockHeader) => {
    if (error) return console.error(error);
    //console.log('received blockheader from remote: ', blockHeader);
    store.dispatch({
      type: 'SET_REMOTE_BLOCK',
      payload: blockHeader
    })
  }).on('data', (blockHeader) => {
    // console.log('data: ', blockHeader);
  });

  /*http provider doesn't support subscriptions so we poll for updates here*/
  setInterval(async () => {
    try {
      // ganache will return 0 as peerCount
      let peerCount = await web3Local.eth.net.getPeerCount()
      //reduxStore.dispatch(setLocalPeerCount(peerCount));
      store.dispatch({
        type: 'SET_LOCAL_PEERCOUNT',
        payload: peerCount
      })
    } catch (error) {
      // TODO handle error
    }
  }, 3000)


  // see collections.js in Mist
  // const _Tabs = new Tabs([{ _id: "browser", url: "https://ethereum.org", redirect: "https://ethereum.org", position: 0 }])
  let _Tabs = new CollectionLight('tabs')
  let dirname = window.__basedir

  /* mock data (not the correct data model representation)*/
  let mockTabs = [
    { _id: 'browser',  url: 'https://www.stateofthedapps.com', redirect: 'https://www.stateofthedapps.com', position: 0 },
    { _id: 'wallet',  url: `file:///${dirname}/wallet.asar/index.html`, redirect: `file:///${dirname}/wallet.asar/index.html`, position: 1, permissions: {
      admin: true
    }},
    { _id: '2',  url: 'http://www.ethereum.org', redirect: 'http://www.ethereum.org', position: 2 },
    { _id: '3',  url: 'https://github.com/ethereum/mist-ui-react', redirect: 'http://www.github.com/philipplgh/mist-react-ui', position: 3 },
    { _id: '4',  url: 'http://www.example.com', redirect: 'http://www.example.com', position: 4 }
  ].map(tab => {tab.id = tab._id; return tab})
 
  mockTabs.forEach(tab => _Tabs.insert(tab))
  
  const _History = new CollectionLight('history')

  // 
  const LocalStore = {
    get(/*selectedTab*/){
      return 1
    }
  }

  // attach fake objects to window and make them immutable
  seal(window, 'i18n', i18n)
  // seal(window, 'web3', _web3)
  // seal(window, 'store', store)
  seal(window, 'Tabs', _Tabs)
  seal(window, 'History', _History)
  seal(window, 'LocalStore', LocalStore)

}

function simulatePreload(){
  console.log('mock api is initialized')
  // load real i18n translations into the fake for a more
  // authentic UI
  // FIXME use when started in electron-shell

  let __basedir = window.__basedir


  init(window, (window.__i18n || {app:{}, mist:{}} ))
}

// init API
if (!is.electron()) { //browser
  simulatePreload()
} 
else if (is.mist()) { //mist / electron
  // API initialized in preload script
}
else if(is.electron()){ //electron shell
  simulatePreload()
}
else { //tau 
  // API initialized in context script
}

