import React, { Component } from 'react'
import { NetworkChooser } from 'ethereum-react-components'

class Config extends Component {
  render(){
    return (
    <main>
      <h1>Network Config</h1>
      <NetworkChooser />
    </main>
    )
  }
}

export default Config