import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../normalize.css'
import './Tools.css'

import { Mist } from '../../API'

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: 'no message'
    }
  }

  handleCreateAccountClicked = () => {
    Mist.createAccount()
  }

  showToast = () => {
    window.api.showToast('hi from webview')
  }

  scanQr = () => {
    window.api.scanQR('hi from webview')
  }

  showMessage = () => {
    if (window.api) {
      const val = window.api.toString()
      this.setState({
        msg: val
      })
    } else {
      this.setState({
        msg: 'api not available'
      })
    }
  }

  render() {
    const { msg } = this.state

    return (
      <main className="tools">
        <h1>
          <strong>TAU</strong> Integration
        </h1>
        <button className="wallet-action" onClick={this.showToast}>
          show toast
        </button>{' '}
        <br />
        <button className="wallet-action" onClick={this.showMessage}>
          show message
        </button>{' '}
        <br />
        <button className="wallet-action" onClick={this.scanQr}>
          scan qr
        </button>{' '}
        <br />
        <button className="wallet-action" onClick={this.benchmark}>
          benchmark
        </button>
        <h1>{msg}</h1>
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  }
}

export default connect(mapStateToProps)(Tools)
