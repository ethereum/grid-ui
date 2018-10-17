
let txCount = 0//await web3.eth.getTransactionCount(accounts[0])
let tx = {
  //"nonce": txCount,
  //"from": '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
  //"to": '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
  // "gas": "0x76c0", // 30400
  //"data": '',
  //"gasPrice": "0x9184e72a000", // 10000000000000
  //"value": "1000000000000000000" //web3Local.utils.toWei('1.0', 'ether')
}

let mockTabs = [
  { _id: 'browser',  url: 'https://www.stateofthedapps.com', redirect: 'https://www.stateofthedapps.com', position: 0 },
  { _id: '2',  url: 'http://www.ethereum.org', redirect: 'http://www.ethereum.org', position: 2 },
  { _id: '3',  url: 'https://github.com/ethereum/mist-ui-react', redirect: 'http://www.github.com/philipplgh/mist-react-ui', position: 3 },
  { _id: '4',  url: 'http://www.example.com', redirect: 'http://www.example.com', position: 4 }
].map(tab => {tab.id = tab._id; return tab})
//let tabs = Tabs.array.sort(el => el.position)

let suggestedDapps = [{
  name: 'Crypto Kitties',
  banner: 'https://www.cryptokitties.co/images/kitty-eth.svg',
  description: 'Lorem Ipsum dolor amet sun Lorem Ipsum dolor amet sun Lorem Ipsum dolor amet sun',
  url: 'https://www.cryptokitties.co/'
}]

const initialState = {

  newTx: null, //tx //required by SendTx popup
  txs: [], //required by TxHistory popup
  
  tabs: mockTabs,
  suggestedDapps,

  accounts: [],

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
    etherPriceUSD: '16',
    browser: {
      whitelist: 'enabled'
    }
  }

}

module.exports = initialState