import {is} from './API/Helpers'
import CollectionLight from './lib/collection'

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


  // load real i18n translations into the fake for a more
  // authentic UI
  // FIXME use when started in electron-shell
  let fs = window.__fs
  let path = window.__path
  let __dirname = window.__dirname
  let app = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'app.en.i18n.json')))
  let _mist = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'mist.en.i18n.json')))
  console.log('mist', _mist)
  lang = {
    ...app,
    ..._mist
  }

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
  var web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));
  window.web3 = web3

  //let accounts = await web3.eth.accounts()
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
    "value": '0x'+web3.utils.toWei('1.0', 'ether')
  }

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

  const store = {
    active: '', 
    network: '',
    remote: {
      timestamp: Date.now()
    },
    newTx: tx, //required by SendTx popup
    txs: [tx], //required by TxHistory popup
    nodes: {
      network: 'Main'
    },
    settings: {
      etherPriceUSD: '16'
    },
    local: {
      sync: {
        highestBlock: 1000, 
        currentBlock: 900,
        startingBlock: 0
      }
    }
  }

  // see collections.js in Mist
  // const _Tabs = new Tabs([{ _id: "browser", url: "https://ethereum.org", redirect: "https://ethereum.org", position: 0 }])
  let _Tabs = new CollectionLight('tabs')
  let dirname = 'D:/Projects/MistTau/mist-ui-react'

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
  seal(window, 'store', store)
  seal(window, 'Tabs', _Tabs)
  seal(window, 'History', _History)
  seal(window, 'LocalStore', LocalStore)

}

function simulatePreload(){
  console.log('mock api is initialized')
  init(window, {
    // ...app,
    // ...mist
  })
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

