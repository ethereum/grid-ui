import React, { Component } from 'react'

export default class Header extends Component {
  render(){
    return (
      <header className="dapp-header dapp-full-header">  
      <nav>
        <ul>
          <li>
            <a href="/" class="active">
              <i className="icon-wallet"></i>
              <span>Wallets</span>
            </a>
          </li>
          <li>
            <a href="/send-from/0xb12b23f5B492C5B9e45f0eaAd8Ba25964082fF82" className="">
              <i className="icon-arrow-up"></i>
              <span>Send</span>
            </a>
          </li>
          <li className="block-syncing" style={{flex: 'auto'}}></li>
          <li className="wallet-balance">
            <h3>Balance</h3>
            <span className="account-balance">0.00
              <span title="This is testnet ether, no real market value">ETHER*</span>
            </span>
          </li>
        </ul>
      </nav>
    </header>
    )
  }
}