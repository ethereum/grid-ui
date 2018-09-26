import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Identicon from '../../components/DappIdenticon'
import {Mist} from '../../API'
import './AccountItem.css'

export default class AccountItem extends Component {
  constructor(props) {
    super(props)
  }
  handleSendTxClick = (e) => {
    e.preventDefault()
    Mist.sendTransaction()
  }
  render() {
    let address = this.props.address
    let name = 'Account ' + (this.props.idx || 0)
    if(this.props.idx === 0){
      name += " (main)"
    }
    let balance = 0.00
    return (
      <Link to={`/account/${address}`} className="wallet-box">
        <div className="account card">
          <div className="account-identicon">
            <Identicon identity={address} class="identicon-medium" />
          </div>
          <div className="account-information">
            <div className="account-name">
              <h3 className="not-ens-name">
                <i title="Account"></i>
                {name}
              </h3>
            </div>
            <div className="account-details">
              <div className="account-address">
                {address}
              </div>
              <div className="account-balance">
                {balance}<span>ether</span>
              </div>
              <div className="account-actions">
                <button className="account-action" onClick={this.handleSendTxClick}>send</button>
                <button className="account-action">tx log</button>
                <button className="account-action">qr</button>
                <Link to={`/browser/${encodeURIComponent(`https://etherscan.io/address/${address}`)}`}><button className="account-action">etherscan</button></Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}