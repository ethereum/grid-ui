import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Identicon } from 'ethereum-react-components'
import { Mist } from '../../API'
import './AccountItem.css'

export default class AccountItem extends Component {
  handleSendTxClicked = e => {
    e.preventDefault()
    const { account } = this.props

    Mist.sendTransaction({
      from: account.address
    })
  }

  handleShowHistoryClicked = e => {
    e.preventDefault()
    Mist.showHistory()
  }

  formatBalance(balanceWei) {
    return '1000' // EthTools.formatBalance(balanceWei)
  }

  render() {
    const { account, idx } = this.props
    const { address } = account

    let name = `Account ${idx || 0}`
    if (idx === 0) {
      name += ' (main)'
    }
    const balance = this.formatBalance(account.balance)
    return (
      <Link to={`/account/${address}`} className="wallet-box">
        <div className="account card">
          <div className="account-identicon">
            <Identicon seed={address} className="identicon-medium" />
          </div>
          <div className="account-information">
            <div className="account-name">
              <h3 className="not-ens-name">
                <i title="Account" />
                {name}
              </h3>
            </div>
            <div className="account-details">
              <div className="account-address">{address}</div>
              <div className="account-balance">
                {balance}
                <span style={{ marginLeft: '5px' }}>Ether</span>
              </div>
              <div className="account-actions">
                <button
                  className="account-action"
                  onClick={this.handleSendTxClicked}
                >
                  send
                </button>
                <button
                  className="account-action"
                  onClick={this.handleShowHistoryClicked}
                >
                  history
                </button>
                <button className="account-action">qr</button>
                <Link
                  to={`/browser/${encodeURIComponent(
                    `https://etherscan.io/address/${address}`
                  )}`}
                >
                  <button className="account-action">etherscan</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
