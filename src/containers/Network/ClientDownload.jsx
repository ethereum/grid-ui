import React, { Component } from 'react'
import { Select, Button, Spinner, Progress } from 'ethereum-react-components'
import { Mist } from '../../API'

const { geth } = Mist

export default class ClientDownload extends Component {
  state = {
    releases: [],
    cachedVersions: {},
    selectedClient: null,
    downloading: false,
    downloadProgress: 0
    // error: ''
  }

  componentDidMount = async () => {
    this.loadCachedVersion()
    const releases = await geth.getReleases()
    this.setState({
      releases: [...releases]
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

  handleClientSelected = selectedClient => {
    this.setState({
      selectedClient
    })
  }

  handleDownloadClicked = async () => {
    const { onClientDownloaded } = this.props
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
      console.log(error)
      // this.setState({ error: 'could not download' })
    }
    onClientDownloaded(value)
    // refresh cached versions
    this.loadCachedVersion()
    this.setState({
      selectedClient: null,
      downloading: false
    })
  }

  render() {
    const {
      releases,
      cachedVersions,
      selectedClient,
      downloading,
      downloadProgress
    } = this.state
    const releaseOptions = releases.map(r => {
      const isCached = cachedVersions[r.fileName] !== undefined
      if (isCached) {
        return {
          label: `${r.name} (downloaded)`,
          value: r,
          isDisabled: true
        }
      }
      return {
        label: r.name,
        value: r
      }
    })
    return (
      <div>
        {releases.length === 0 ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <Select
            isDisabled={downloading}
            value={selectedClient}
            options={releaseOptions}
            onChange={this.handleClientSelected}
          />
        )}
        {downloading && (
          <div style={{ marginTop: 20 }}>
            <Progress value={downloadProgress} max="100" />
          </div>
        )}
        <Button
          style={{ marginTop: 20 }}
          disabled={!selectedClient || downloading}
          onClick={this.handleDownloadClicked}
        >
          download
        </Button>
      </div>
    )
  }
}
