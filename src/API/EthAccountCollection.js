import web3 from './Web3'
import CollectionLight from '../lib/collection'

// EthAccountsCollection is a collection wrapper aound web3 accounts
// see: https://github.com/ethereum/meteor-package-accounts/blob/master/accounts.js
export default class EthAccountsCollection extends CollectionLight {
  constructor() {
    super('ethereum_accounts')
    this._init()
  }

  _init() {
    if (typeof web3 === 'undefined') {
      console.warn(
        "EthAccounts couldn't find web3, please make sure to instantiate a web3 object before calling EthAccounts.init()"
      )
      return
    }
    this._addAccounts()
  }

  async _addAccounts() {
    // UPDATE normal accounts on start
    // let accounts = await web3.eth.getAccounts()
    this.upsert(
      '0xF5A5d5c30BfAC14bf207b6396861aA471F9A711D',
      '0xF5A5d5c30BfAC14bf207b6396861aA471F9A711D'
    )
    this.upsert(
      '0xdf4B9dA0aef26bEE9d55Db34480C722906DB4b02',
      '0xdf4B9dA0aef26bEE9d55Db34480C722906DB4b02'
    )
    this.upsert(
      '0x0093771A9b21fd15B411D2dA3119387BDe3EbAb8',
      '0x0093771A9b21fd15B411D2dA3119387BDe3EbAb8'
    )

    // console.log('accounts:', accounts)
  }
}
