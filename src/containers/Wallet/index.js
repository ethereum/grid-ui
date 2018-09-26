import React, { Component } from 'react'
import "../normalize.css"
import "./Wallet.css"
import Account from './AccountItem'
import {Collections} from '../../API'

const {Accounts} = Collections

console.log('accounts', Accounts)

export default () => 
<main className="wallet">
  <h1><strong>Accounts</strong> Overview</h1>

  <div className="wallet-actions">
    <button className="wallet-action">create</button>
    <button className="wallet-action">import</button>
  </div>

  <h2>Network Main</h2>

  <div className="wallet-box-list">
    {
      Accounts.array.map((address, idx) => {
        return <Account key={address} address={address} idx={idx}></Account>
      })
    }
  </div>              
</main>