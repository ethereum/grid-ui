import React, { Component } from 'react'
import { FeeSelector } from 'ethereum-react-components'

class SendTx extends Component {
  render(){
    return (
    <main>
      <h1>Send Tx</h1>    
      <FeeSelector />
    </main>
    )
  }
}

export default SendTx