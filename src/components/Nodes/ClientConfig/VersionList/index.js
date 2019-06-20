import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import List from '@material-ui/core/List'
import Notification from '../../../shared/Notification'
import { setRelease } from '../../../../store/client/actions'
import VersionListItem from './VersionListItem'
import VersionsAvailableText from './VersionsAvailableText'
import LatestVersionWarning from './LatestVersionWarning'

class VersionList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    handleReleaseSelect: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
    selectedRelease: PropTypes.object
  }

  state = {
    releases: [],
    localReleaseCount: 0,
    loadingReleases: false,
    downloadError: null
  }

  componentDidMount() {
    this.loadReleases()
  }

  componentWillReceiveProps({ client: nextClient }) {
    const { client: oldClient } = this.props
    if (oldClient && nextClient !== oldClient) {
      // this.loadLocalReleases()
      this.setState({ releases: [] })
      this.loadReleases(nextClient)
    }
  }

  dismissDownloadError = () => {
    this.setState({ downloadError: null })
  }

  loadReleases = async client => {
    // eslint-disable-next-line
    client = client || this.props.client
    this.setState({ loadingReleases: true })
    const localReleases = {}
    // console.time('load releases')
    let releases = await client.getReleases()
    // console.timeEnd('load releases')
    // console.time('dedupe')
    let count = 0
    releases.forEach(r => {
      if (!r.remote) {
        count += 1
        localReleases[r.fileName] = r
      }
    })
    releases = releases.filter(r => !r.remote || !localReleases[r.fileName])
    // console.timeEnd('dedupe') // for 132 -> 83 ms
    this.setState(
      {
        releases,
        loadingReleases: false,
        localReleaseCount: count,
        // lastLoadTimestamp used in tests
        lastLoadTimestamp: new Date().getTime()
      },
      () => {
        // Set first local release as active
        // TODO: revisit after redux-persist reintroduced
        const firstLocalRelease = releases.find(release => {
          return !release.remote
        })
        if (firstLocalRelease) {
          this.handleReleaseSelect(firstLocalRelease)
        }
      }
    )
  }

  isLocalRelease = release => {
    return !release.remote
  }

  handleRefresh = () => {
    this.loadReleases()
  }

  isSelectedRelease = release => {
    const { selectedRelease } = this.props
    if (!release) return false
    return release.fileName === selectedRelease.fileName
  }

  handleReleaseSelect = release => {
    const { client, dispatch, handleReleaseSelect } = this.props
    dispatch(setRelease(client.name, release))
    handleReleaseSelect(release)
  }

  handleReleaseDownloaded = release => {
    const releaseDownloaded = { ...release, remote: false }
    const { releases, localReleaseCount } = this.state
    const index = releases.findIndex(r => r.fileName === release.fileName)
    // releases.splice(index, 0, releaseDownloaded)
    releases[index] = releaseDownloaded
    this.setState(
      {
        releases: [...releases],
        localReleaseCount: localReleaseCount + 1
      },
      () => {
        this.handleReleaseSelect(release)
      }
    )
  }

  renderVersionList = () => {
    const { client } = this.props
    const { releases } = this.state
    const renderListItems = () => {
      const list = releases.map((release, i) => {
        return (
          <VersionListItem
            client={client}
            release={release}
            key={i}
            isSelectedRelease={this.isSelectedRelease}
            handleReleaseSelect={this.handleReleaseSelect}
            handleDownloadError={downloadError =>
              this.setState({ downloadError })
            }
            handleReleaseDownloaded={this.handleReleaseDownloaded}
          />
        )
      })
      return list
    }
    return (
      <StyledList data-test-id="version-list">{renderListItems()}</StyledList>
    )
  }

  render() {
    const { client, selectedRelease } = this.props
    const {
      downloadError,
      loadingReleases,
      localReleaseCount,
      lastLoadTimestamp,
      releases
    } = this.state

    return (
      <div>
        {downloadError && (
          <Notification
            type="error"
            message={downloadError}
            onDismiss={this.dismissDownloadError}
          />
        )}

        <VersionsAvailableText
          loadingReleases={loadingReleases}
          localReleaseCount={localReleaseCount}
          totalReleaseCount={releases.length}
          lastLoadTimestamp={lastLoadTimestamp}
        />

        <LatestVersionWarning
          displayName={client.displayName}
          selectedVersion={selectedRelease.version}
          latestRelease={releases[0]}
          handleReleaseSelect={this.handleReleaseSelect}
        />

        {this.renderVersionList()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    selectedRelease: state.client[state.client.selected].release
  }
}

export default connect(mapStateToProps)(VersionList)

const StyledList = styled(List)`
  min-height: 200px;
  max-height: calc(100vh - 295px);
  overflow-y: scroll;
`
