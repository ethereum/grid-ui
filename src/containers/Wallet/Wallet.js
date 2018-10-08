import React, { Component } from 'react'
import { connect } from 'react-redux';
import "../normalize.css"
import "./Wallet.css"
import Account from './AccountItem'
import {Mist} from '../../API'

class Wallet extends Component {
  constructor(props) {
    super(props)
  }
  handleCreateAccountClicked = () => {
    Mist.createAccount()
  }
  render(){
    let accounts = this.props.accounts
    return (
    <main className="wallet">
      <h1><strong>Accounts</strong> Overview</h1>
    
      <div className="wallet-actions">
        <button className="wallet-action" onClick={this.handleCreateAccountClicked}>create</button>
        <button className="wallet-action">import</button>
      </div>
    
      <h2>Network Main</h2>
    
      <div className="wallet-box-list">
        {
          accounts.map((account, idx) => {
            return <Account key={account.address} account={account} idx={idx}></Account>
          })
        }
      </div>              
    </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}

export default connect(mapStateToProps)(Wallet)