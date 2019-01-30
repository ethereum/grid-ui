import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from './Header'

export default class Account extends Component {
  static propTypes = {
    match: PropTypes.any
  }

  render() {
    const { match } = this.props

    return (
      <main className="wallet">
        <Header />
        <h1>
          <strong>Account</strong> {match.params.address}
        </h1>
        <div className="wallet-box-list" />
      </main>
    )
  }
}
