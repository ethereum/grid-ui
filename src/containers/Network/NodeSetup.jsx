import React, { Component } from 'react'
import { Select, Button, Spinner } from 'ethereum-react-components'
import { Mist } from './../../API'
import { get } from 'http';
const { geth } = Mist

export default class NodeSetup extends Component {
  state = {
    releases: [],
    selectedClient: null,
    downloading: false,
    error: ''
  }
  componentDidMount = async () => {
    const releases = await geth.getReleases()
    this.setState({
      releases: [
        ...releases
      ]
    })
  }
  handleClientSelected = (selectedClient) => {
    this.setState({
      selectedClient
    })
  }
  handleDownloadClicked = async () => {
    const { selectedClient } = this.state
    const { value } = selectedClient // as IRelease
    this.setState({
      downloading: true
    })
    try {
      await geth.download(value)
    } catch (error) {
      this.setState({
        error: 'could not download'
      })
    }
    this.setState({
      downloading: false
    })
  }
  render(){
    const { releases, selectedClient, downloading } = this.state
    const releaseOptions = releases.map(r => {
      return {label: r.name, value: r}
    })
    return (
      <main>
        <h1>Setup Node</h1>
        {
          releases.length === 0
          ? <Spinner />
          : <Select isDisabled={downloading} value={selectedClient} options={releaseOptions} onChange={this.handleClientSelected} />
        }
        {downloading && <span>progress bar here</span>}
        <Button loading={downloading} disabled={selectedClient ? false : true} onClick={this.handleDownloadClicked} >download</Button>
      </main>
    )
  }
}
