import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import List from '@material-ui/core/List'
import Notification from '../../../shared/Notification'
import { setRelease } from '../../../../store/plugin/actions'
import VersionListItem from './VersionListItem'
import VersionsAvailableText from './VersionsAvailableText'
import LatestVersionWarning from './LatestVersionWarning'
import { Grid } from '../../../../API'

class VersionList extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    handleReleaseSelect: PropTypes.func.isRequired,
    plugin: PropTypes.object.isRequired,
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

  componentWillReceiveProps({ plugin: nextPlugin }) {
    const { plugin: oldPlugin } = this.props
    if (oldPlugin && nextPlugin !== oldPlugin) {
      // this.loadLocalReleases()
      this.setState({ releases: [] })
      this.loadReleases(nextPlugin)
    }
  }

  dismissDownloadError = () => {
    this.setState({ downloadError: null })
  }

  loadReleases = async plugin => {
    // eslint-disable-next-line
    plugin = plugin || this.props.plugin
    this.setState({ loadingReleases: true })
    const localReleases = {}
    // console.time('load releases')
    let releases = await plugin.getReleases()
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
        // Set first local release as active if no release is already set
        const { selectedRelease } = this.props
        if (!selectedRelease) {
          const firstLocalRelease = releases.find(release => {
            return !release.remote
          })
          if (firstLocalRelease) {
            this.handleReleaseSelect(firstLocalRelease)
          }
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
    const { plugin, dispatch, handleReleaseSelect } = this.props
    dispatch(setRelease(plugin, release))
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
    const { plugin } = this.props
    const { releases } = this.state
    const renderListItems = () => {
      const list = releases.map((release, i) => {
        return (
          <VersionListItem
            plugin={plugin}
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
      <StyledList data-test-id="version-list" className="scroll-container">
        {renderListItems()}
      </StyledList>
    )
  }

  render() {
    const { plugin, selectedRelease } = this.props
    const {
      downloadError,
      loadingReleases,
      localReleaseCount,
      lastLoadTimestamp,
      releases
    } = this.state

    return (
      <Fragment>
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
          loadReleases={() => {
            this.loadReleases()
          }}
          openCache={() => {
            Grid.openCache(plugin.name)
          }}
        />

        <LatestVersionWarning
          displayName={plugin.displayName}
          selectedVersion={selectedRelease.version}
          latestRelease={releases[0]}
          handleReleaseSelect={this.handleReleaseSelect}
        />

        {this.renderVersionList()}
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    selectedRelease: state.plugin[state.plugin.selected].release
  }
}

export default connect(mapStateToProps)(VersionList)

const StyledList = styled(List)`
  min-height: 200px;
  max-height: '100%',
  overflow-y: scroll;
`
