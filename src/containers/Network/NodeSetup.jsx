import React, { Component } from 'react'
import { Select, Button, Spinner } from 'ethereum-react-components'
import { Mist } from './../../API'
const { geth } = Mist

export default class NodeSetup extends Component {
  state = {
    releases: [],
    cachedVersions: {},
    selectedClient: null,
    downloading: false,
    downloadProgress: 0,
    error: ''
  }
  componentDidMount = async () => {
    this.loadCachedVersion()
    const releases = await geth.getReleases()
    this.setState({
      releases: [
        ...releases
      ]
    })
  }
  loadCachedVersion = async () => {
    const installed = await geth.getLocalBinaries()
    const cachedVersions = {}
    installed.forEach(release => {
      cachedVersions[release.fileName] = true
    })
    this.setState({
      cachedVersions
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
      await geth.download(value, progress => {
        this.setState({
          downloadProgress: progress
        })
      })
    } catch (error) {
      this.setState({
        error: 'could not download'
      })
    }
    // refresh cached versions
    this.loadCachedVersion()
    this.setState({
      selectedClient: null,
      downloading: false
    })
  }
  render(){
    const { releases, cachedVersions, selectedClient, downloading, downloadProgress } = this.state
    const releaseOptions = releases.map(r => {
      let isCached = cachedVersions[r.fileName] !== undefined
      if(isCached){
        return {
          label: r.name + ' (downloaded)', 
          value: r,
          isDisabled: true
        }
      } else {
        return {
          label: r.name, 
          value: r
        }
      }
    })
    return (
      <main>
        <h1>Setup Node</h1>
        {
          releases.length === 0
          ? <Spinner />
          : <Select isDisabled={downloading} value={selectedClient} options={releaseOptions} onChange={this.handleClientSelected} />
        }
        {downloading && <progress style={{width: '100%'}} value={downloadProgress} max="100"></progress>}
        <Button style={{marginTop: 20}} loading={downloading} disabled={selectedClient ? false : true} onClick={this.handleDownloadClicked}>download</Button>
      </main>
    )
  }
}
