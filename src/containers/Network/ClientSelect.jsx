import React, { Component } from 'react'
import { Select } from 'ethereum-react-components'
import { Mist } from '../../API'

const { geth } = Mist

export default class ClientSelect extends Component {
  state = {
    selectedClient: null,
    installedBinaries: []
  }

  componentDidMount = async () => {
    this.loadCachedVersion()
  }

  loadCachedVersion = async () => {
    const installedBinaries = await geth.getLocalBinaries()
    this.setState({
      installedBinaries
    })
    if (installedBinaries.length === 1) {
      const client = installedBinaries[0]
      this.setState({
        selectedClient: {
          label: client.fileName,
          value: client
        }
      })
    }
  }

  handleClientSelected = selectedClient => {
    const { onClientSelected } = this.props
    onClientSelected(selectedClient)
    this.setState({
      selectedClient
    })
  }

  render() {
    const { installedBinaries, selectedClient } = this.state
    const clientBinaries = installedBinaries.map(ib => {
      return {
        label: ib.fileName,
        value: ib
      }
    })
    return (
      <div>
        <Select
          value={selectedClient}
          options={clientBinaries}
          onChange={this.handleClientSelected}
        />
      </div>
    )
  }
}
