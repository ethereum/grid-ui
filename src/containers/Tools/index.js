import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import "../normalize.css"
import "./Tools.css"

import {Mist} from '../../API'

class Tools extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: 'no message',
      result: 0
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
    if(window.api){
      let val = window.api.toString()
      this.setState({
        msg: val
      })
    }else{
      this.setState({
        msg: 'api not available'
      })
    }
  }
  render(){
    return (
    <main className="tools">
      <h1><strong>TAU</strong> Integration</h1>

      <button className="wallet-action" onClick={this.showToast}>show toast</button> <br/>
      <button className="wallet-action" onClick={this.showMessage}>show message</button> <br/>
      <button className="wallet-action" onClick={this.scanQr}>scan qr</button> <br/>
      <button className="wallet-action" onClick={this.benchmark}>benchmark</button>
    
      <h1>{this.state.msg}</h1>

      <h1>{this.state.m}</h1>

    
    </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts
  };
}

export default withRouter(connect(mapStateToProps)(Tools))