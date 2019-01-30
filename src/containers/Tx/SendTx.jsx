import React, { Component } from 'react'
import { FormSendTx } from 'ethereum-react-components'

class SendTx extends Component {
  render() {
    const dummyTx = {
      nonce: 0,
      from: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
      to: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
      gas: '0x76c0', // 30400
      data: '',
      gasPrice: '0x9184e72a000', // 10000000000000
      value: '1000000000000000000'
    }

    const nodes = {
      network: 'main',
      local: { blockNumber: 100 },
      remote: { blockNumber: 100 }
    }

    return (
      <main>
        <h1>Send Tx</h1>
        <FormSendTx network={nodes.network} newTx={dummyTx} />
      </main>
    )
  }
}

export default SendTx
