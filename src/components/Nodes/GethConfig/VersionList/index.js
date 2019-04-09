import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import semver from 'semver'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Notification from '../../../shared/Notification'
import { Mist } from '../../../../API'
import { setRelease } from '../../../../store/client/actions'
import AvailableVersionText from './AvailableVersionText'
import VersionListItem from './VersionListItem'

const { geth } = Mist

class VersionList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    client: PropTypes.object
  }

  state = {
    localReleases: [],
    remoteReleases: [],
    loadingRemoteReleases: false,
    downloadError: null
  }

  excludeUnstableReleases = release => !release.fileName.includes('unstable')

  excludeAlreadyInstalledReleases = release => {
    const { localReleases } = this.state
    const versions = localReleases.map(r => r.fileName)
    return !versions.includes(release.fileName)
  }

  excludeRemoteOfAlreadyInstalledReleases = release => {
    const isLocal = this.isLocalRelease(release)
    if (isLocal) return true

    const { localReleases } = this.state
    const versions = localReleases.map(r => r.fileName)
    const hasLocalCounterpart = versions.includes(release.fileName)

    return !hasLocalCounterpart
  }

  getAllReleases = () => {
    const { remoteReleases, localReleases } = this.state
    const allReleases = [...localReleases, ...remoteReleases]
    const releases = allReleases.sort((v1, v2) => {
      return semver.compare(v2.version, v1.version)
    })

    return releases
  }

  componentDidMount = async () => {
    this.loadLocalReleases()
    this.loadRemoteReleases()
  }

  loadLocalReleases = async selectedRelease => {
    const releases = await geth.getLocalBinaries()
    const localReleases = releases.filter(this.excludeUnstableReleases)
    this.setState({ localReleases }, () => {
      const { client } = this.props
      const { release } = client
      if (selectedRelease) {
        // Set selectedRelease passed into func
        this.setSelectedRelease(selectedRelease)
        // Remove selectedRelease from remoteReleases,
        // so there are no duplicates in the list
        this.dedupedRemoteReleases()
      } else if (!release.fileName) {
        // Set latest release if no release selected
        this.setSelectedRelease(localReleases[0])
      } else if (release.fileName) {
        // Ensure previously selected release still exists,
        // otherwise replace with latest release
        if (!localReleases.includes(release)) {
          this.setSelectedRelease(localReleases[0])
        }
      }
    })
  }

  dedupedRemoteReleases = () => {
    const { remoteReleases } = this.state
    const dedupedRemoteReleases = remoteReleases.filter(
      this.excludeAlreadyInstalledReleases
    )
    this.setState({ remoteReleases: dedupedRemoteReleases })
  }

  setSelectedRelease = release => {
    const { dispatch } = this.props
    dispatch(setRelease({ release }))
  }

  loadRemoteReleases = async () => {
    this.setState({ loadingRemoteReleases: true })
    const releases = await geth.getReleases()
    const remoteReleases = releases
      .filter(this.excludeUnstableReleases)
      .filter(this.excludeRemoteOfAlreadyInstalledReleases)
    this.setState({ remoteReleases })
    this.setState({ loadingRemoteReleases: false })
  }

  handleReleaseSelected = release => {
    const { dispatch } = this.props
    if (this.isLocalRelease(release)) {
      dispatch(setRelease({ release }))
    } else {
      this.downloadRelease(release)
    }
  }

  downloadRelease = async release => {
    const { remoteReleases } = this.state
    const index = remoteReleases.indexOf(release)
    if (index === -1) throw Error('Release not found')

    // Return if already downloading
    if (release.progress >= 0) return

    // Add `progress` property to release
    const updatedReleases = remoteReleases.slice()
    updatedReleases[index].progress = 0
    this.updateDownloadProgress(index, 0, release)

    try {
      geth.download(release, progress => {
        if (progress % 10 === 0) {
          this.updateDownloadProgress(index, progress, release)
        }
      })
    } catch (error) {
      this.setState({ downloadError: error })
    }
  }

  updateDownloadProgress = (releaseIndex, progress, release) => {
    const { remoteReleases } = this.state
    const updatedReleases = remoteReleases.slice()

    if (progress === 100) {
      delete updatedReleases[releaseIndex].progress
      return this.setState({ remoteReleases: updatedReleases }, () => {
        // Reload local with selectedRelease
        this.loadLocalReleases(release)
      })
    }

    updatedReleases[releaseIndex].progress = progress
    return this.setState({ remoteReleases: updatedReleases })
  }

  renderLatestVersionWarning = () => {
    const { client } = this.props
    const { remoteReleases } = this.state
    const { release } = client
    if (!release || !remoteReleases.length) {
      return null
    }
    const latestRelease = remoteReleases[0]
    const latestVersion = latestRelease.version
    const selectedVersion = release.version

    if (semver.compare(selectedVersion, latestVersion)) {
      return (
        <Notification
          type="warning"
          message={
            <span>
              You are using an older version of Geth ({selectedVersion})<br />
              New releases contain performance and security enhancements.
            </span>
          }
          onDismiss={this.onDismissError}
          action={
            <Button
              onClick={() => {
                this.handleReleaseSelected(latestRelease)
              }}
            >
              Use {latestVersion}
            </Button>
          }
        />
      )
    }
    return null
  }

  isSelectedRelease = release => {
    const { client } = this.props
    if (!client.release) return false
    return release.fileName === client.release.fileName
  }

  isLocalRelease = release => {
    return !release.location.includes('https://', 0)
  }

  renderVersionList = () => {
    const releases = this.getAllReleases()

    const listItems = releases.map(release => {
      return (
        <VersionListItem
          key={release.name}
          fileName={release.fileName}
          name={release.name}
          progress={release.progress}
          isSelectedRelease={() => this.isSelectedRelease(release)}
          isLocalRelease={() => this.isLocalRelease(release)}
          handleReleaseSelected={() => this.handleReleaseSelected(release)}
        />
      )
    })

    return <StyledList>{listItems}</StyledList>
  }

  render() {
    const { downloadError, localReleases, loadingRemoteReleases } = this.state

    return (
      <div>
        <AvailableVersionText
          localReleases={localReleases}
          loadRemoteReleases={this.loadRemoteReleases}
          loadingRemoteReleases={loadingRemoteReleases}
          getAllReleases={this.getAllReleases}
        />
        {this.renderVersionList()}
        {this.renderLatestVersionWarning()}
        {downloadError && <StyledError>{downloadError}</StyledError>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    client: state.client
  }
}

export default connect(mapStateToProps)(VersionList)

const StyledList = styled(List)`
  max-height: 260px;
  overflow: scroll;
`

const StyledError = styled.div`
  color: red;
`
