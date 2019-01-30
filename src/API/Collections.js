import CollectionLight from '../lib/collection'
import EthAccountsCollection from './EthAccountCollection'

// https://github.com/ethereum/mist/blob/develop/interface/client/collections.js

const _Tabs = new CollectionLight('tabs')
const LastVisitedPages = new CollectionLight('last-visted-pages')
const _History = new CollectionLight('history')

const Accounts = new EthAccountsCollection()

// window.X are mocked collections that are inserted by the fakeAPI
export default {
  Tabs: window.Tabs || _Tabs,
  LastVisitedPages,
  History: window.History || _History,
  Accounts
}
