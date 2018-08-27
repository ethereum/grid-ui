import CollectionLight from '../lib/collection'

// https://github.com/ethereum/mist/blob/develop/interface/client/collections.js

let Tabs = new CollectionLight('tabs')
let LastVisitedPages = new CollectionLight('last-visted-pages')
let History = new CollectionLight('history')

// let tabs = Tabs.find({}, { sort: { position: 1 } }).fetch();

/* mock data (not the correct data model representation)
let tabs = [
  {
    id: 'wallet',
    name: 'Wallet',
    url: `file:///${dirname}/wallet.asar/index.html`,
    redirect: `file://${dirname}/wallet/index.html`,
    position: 0,
    permissions: {
      admin: true
    }
  },
  {
    id: 'browser',
    name: 'browser',
    url: 'http://www.ethereum.org'
  },
  {
    id:2, 
    name: 'tab 2',
    // icon: "file:///D:/Projects/mist/wallet/wallet-icon.png",
    icon: 'file:///D:/Projects/MistTau/mist-ui-react/icons/wallet-icon.png',
    selected: true,
    url: 'https://www.stateofthedapps.com',
    subMenu: [
      {name: 'action 1', selected: true},
      {name: 'action 2'}
    ]
  },
  {id:3, name: 'tab 3', url: 'http://www.github.com/philipplgh'},
  {id:4, name: 'tab 4', url: 'http://www.example.com'},
]
*/

export default {
  Tabs,
  LastVisitedPages,
  History
}