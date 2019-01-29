import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import '../normalize.css'
import './Wallet.css'
import Account from './AccountItem'
import { Mist } from '../../API'

class Wallet extends Component {
  static propTypes = {
    accounts: PropTypes.array
  }

  handleCreateAccountClicked = () => {
    Mist.createAccount()
  }

  render() {
    const { accounts } = this.props

    return (
      <main className="wallet">
        <h1>
          <strong>Accounts</strong> Overview
        </h1>

        <div className="wallet-actions">
          <button
            className="wallet-action"
            onClick={this.handleCreateAccountClicked}
          >
            create
          </button>
          <button className="wallet-action">import</button>
        </div>

        <h2>Network Main</h2>

        <div className="wallet-box-list">
          {accounts.map((account, idx) => {
            return <Account key={account.address} account={account} idx={idx} />
          })}
        </div>
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  }
}

export default withRouter(connect(mapStateToProps)(Wallet))
