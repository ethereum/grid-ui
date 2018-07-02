// must not import like this: 
// import {Helpers} from './API'
// otherwise API will be cached before being set
const Helpers = require('./API/Helpers.js')
const isElectron = Helpers.isElectron

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

class Collection extends Array {
  constructor() {
    super();
    this.onceSynced = Promise.resolve()    
  }
  find() {
    return this;
  }
  fetch () {
    return this;
  }
  findOne() {
    return this;
  }
  upsert() {
    return this;
  }
  init() {
    return this;
  }
}

class Tabs extends Collection {
  constructor(values) {
    super()
    values.forEach(val => {
      this.push(val)
    })
  }
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
  
  const web3 = {
    eth: {
      net: {
        getPeerCount: () => {
          return Promise.resolve(99)
        }
      }
    }
  }

  const store = {
    active: '', 
    network: '',
    remote: {
      timestamp: Date.now()
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
  const _Tabs = new Tabs([{ _id: "browser", url: "https://ethereum.org", redirect: "https://ethereum.org", position: 0 }])
  const _History = new Collection()

  const LocalStore = {
    get(/*selectedTab*/){
      return 1
    }
  }

  // attach fake objects to window and make them immutable
  seal(window, 'i18n', i18n)
  seal(window, 'web3', web3)
  seal(window, 'store', store)
  seal(window, 'Tabs', _Tabs)
  seal(window, 'History', _History)
  seal(window, 'LocalStore', LocalStore)

}

// browser / tau fallback -> no preload script
// auto-initialize
if (!isElectron()) {
  console.log('auto init', window)
  init(window, {
    // ...app,
    // ...mist
  })
  console.log('web3:', JSON.stringify(window.web3))
} else {
  module.exports = init
}
