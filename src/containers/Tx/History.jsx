import React, { Component } from 'react'
import { TxHistory } from 'ethereum-react-components'

class TxHistoryWrapper extends Component {
  render(){
    return (
    <main>
      <h1>Tx History</h1>    
      <TxHistory txs={[]}/>
    </main>
    )
  }
}

export default TxHistoryWrapper