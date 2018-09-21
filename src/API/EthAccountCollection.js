import web3 from './Web3'
import CollectionLight from '../lib/collection'

// EthAccountsCollection is a collection wrapper aound web3 accounts
// see: https://github.com/ethereum/meteor-package-accounts/blob/master/accounts.js 
export default class EthAccountsCollection extends CollectionLight {
  constructor(){
    super('ethereum_accounts')
    this._init()
  }
  _init(){
    if (typeof web3 === "undefined") {
      console.warn("EthAccounts couldn't find web3, please make sure to instantiate a web3 object before calling EthAccounts.init()");
      return;
    }
    this._addAccounts()
  }
  async _addAccounts(){
    // UPDATE normal accounts on start
    let accounts = await web3.eth.getAccounts()
    console.log('accounts:', accounts)
  }
}