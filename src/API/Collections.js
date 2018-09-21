import CollectionLight from '../lib/collection'
import EthAccountsCollection from './EthAccountCollection'

// https://github.com/ethereum/mist/blob/develop/interface/client/collections.js

let _Tabs = new CollectionLight('tabs')
let LastVisitedPages = new CollectionLight('last-visted-pages')
let _History = new CollectionLight('history')

let EthAccounts = new EthAccountsCollection()

// let tabs = _Tabs.find({}, { sort: { position: 1 } }).fetch();
let dirname = 'D:/Projects/MistTau/mist-ui-react'

async function initTabs(){
  await _Tabs.onceSynced()
  // Overwrite wallet on start again,
  // but use $set to preserve account titles
  _Tabs.upsert(
    { _id: 'wallet' },
    {
      $set: {
        url: `file://${dirname}/wallet/index.html`,
        redirect: `file://${dirname}/wallet/index.html`,
        position: 0,
        permissions: {
          admin: true
        }
      }
    }
  );

  if (!_Tabs.findOne('browser')) {
    const url = 'https://www.stateofthedapps.com';
    _Tabs.insert({
      _id: 'browser',
      url,
      redirect: url,
      position: 1
    });
  } else {
    _Tabs.upsert(
      { _id: 'browser' },
      {
        $set: { position: 1 }
      }
    );
  }
}
initTabs()

//window.X are mocked collections that are inserted by the fakeAPI
export default {
  Tabs: window.Tabs || _Tabs,
  LastVisitedPages,
  History: window.History || _History,
  EthAccounts
}