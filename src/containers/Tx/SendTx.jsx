import React, { Component } from 'react'
import { FormSendTx } from 'ethereum-react-components'

class SendTx extends Component {
  render(){
    return (
    <main>
      <h1>Send Tx</h1>    
      <FormSendTx />
    </main>
    )
  }
}

export default SendTx