import React, { Component } from 'react'
import Header from './Header'

export default class Account extends Component {
  render(){
    return (
      <main className="wallet">
        <Header />
        <h1><strong>Account</strong> {this.props.match.params.address}</h1>
        <div className="wallet-box-list">
        </div>     
      </main>
    )
  }
}