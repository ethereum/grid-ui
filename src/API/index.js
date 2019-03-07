export { default as BigNumber } from 'bignumber.js'
// https://github.com/ethereum/meteor-package-tools/blob/master/ethtools.js

export class EthTools {
  static formatBalance(input) {
    return window.web3.utils.fromWei(input, 'ether')
  }

  static isAddress(address) {
    return window.web3.utils.isAddress(address)
  }
}

export { default as ipc } from './Ipc'
export { Helpers } from './Helpers'
export { default as i18n } from './i18n'
export { default as LocalStore } from './LocalStore'
export { default as web3 } from './Web3'
export { default as Mist } from './Mist'
export { default as Collections } from './Collections'
