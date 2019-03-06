import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import semver from 'semver'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import MinimizeIcon from '@material-ui/icons/Minimize'
import MaximizeIcon from '@material-ui/icons/Maximize'
import Spinner from '../../shared/Spinner'
import { Mist } from '../../../API'
import { without } from '../../../lib/utils'

const { geth } = Mist

export default class VersionList extends Component {
  state = {
    localReleases: [],
    remoteReleases: [],
    selectedRelease: null,
    loadingRemoteReleases: false,
    downloadError: null,
    showList: true
  }

  excludeUnstableReleases = release => !release.fileName.includes('unstable')

  excludeAlreadyInstalledReleases = release => {
    const { localReleases } = this.state
    const versions = localReleases.map(r => r.version)
    return !versions.includes(release.version)
  }

  allReleases = () => {
    const { remoteReleases, localReleases } = this.state
    const allReleases = [...localReleases, ...remoteReleases]
    const releases = allReleases.sort((v1, v2) => {
      return semver.compare(v2.version, v1.version)
    })

    return releases
  }

  releaseName = release => {
    const { fileName } = release
    const nameParts = fileName.split('-')
    const name = `${nameParts[0]} ${nameParts[1]} ${nameParts[3]}`
    return name
  }

  componentDidMount = async () => {
    this.loadLocalReleases()
    this.loadRemoteReleases()
  }

  loadLocalReleases = async release => {
    const releases = await geth.getLocalBinaries()
    const localReleases = releases.filter(this.excludeUnstableReleases)
    let selectedRelease = release
    if (!selectedRelease) {
      ;[selectedRelease] = localReleases
    }
    this.setState({ localReleases, selectedRelease })
  }

  loadRemoteReleases = async () => {
    this.setState({ loadingRemoteReleases: true })
    const releases = await geth.getReleases()
    const remoteReleases = releases
      .filter(this.excludeUnstableReleases)
      .filter(this.excludeAlreadyInstalledReleases)
    this.setState({ remoteReleases })
    this.setState({ loadingRemoteReleases: false })
  }

  handleReleaseSelected = selectedRelease => {
    if (this.isLocalRelease(selectedRelease)) {
      this.setState({ selectedRelease })
    } else {
      this.downloadRelease(selectedRelease)
    }
  }

  isLocalRelease = release => {
    return !release.location.includes('http')
  }

  downloadRelease = async release => {
    const { remoteReleases } = this.state
    const index = remoteReleases.indexOf(release)
    if (index === -1) {
      throw Error('Release not found')
    }
    // Return if already downloading
    if (release.progress >= 0) {
      return
    }
    // Add `progress` property to release
    remoteReleases[index].progress = 0
    this.setState({ remoteReleases })
    try {
      await geth.download(release, progress => {
        remoteReleases[index].progress = progress
        this.setState({ remoteReleases })
      })
    } catch (error) {
      this.setState({ downloadError: error })
    }
    delete remoteReleases[index].progress
    const selectedRelease = release
    this.setState({ remoteReleases, selectedRelease })
  }

  toggleShowList = () => {
    const { showList } = this.state
    this.setState({ showList: !showList })
  }

  renderVersionsAvailable = () => {
    const { localReleases, loadingRemoteReleases, showList } = this.state
    const releases = this.allReleases()

    if (releases.length === 0) {
      return <Spinner style={{ margin: '20px 0' }} />
    }

    return (
      <div>
        <ToggableTypography variant="h6" onClick={this.toggleShowList}>
          {showList ? (
            <MinimizeIcon fontSize="small" />
          ) : (
            <MaximizeIcon fontSize="small" />
          )}
          {loadingRemoteReleases && (
            <React.Fragment>
              Loading versions...
              <RemoteReleaseLoadingSpinner size={18} thickness={4} />
            </React.Fragment>
          )}
          {!loadingRemoteReleases && (
            <React.Fragment>
              {releases.length} versions available
            </React.Fragment>
          )}
        </ToggableTypography>
        {showList && (
          <Typography variant="subtitle1" gutterBottom>
            {localReleases.length} versions downloaded
          </Typography>
        )}
      </div>
    )
  }

  renderVersionList = () => {
    const { showList } = this.state
    if (!showList) {
      return null
    }
    const { selectedRelease } = this.state
    const releases = this.allReleases()
    const renderIcon = release => {
      let icon = <BlankIconPlaceholder />
      if (release.progress) {
        icon = <Spinner size={20} />
      } else if (!this.isLocalRelease(release)) {
        icon = <CloudDownloadIcon color="primary" />
      } else if (release === selectedRelease) {
        icon = <CheckBoxIcon color="primary" />
      }
      return icon
    }
    const renderListItems = () => {
      const list = releases.map((release, i) => {
        let actionLabel
        if (this.isLocalRelease(release)) {
          actionLabel = 'Use'
          if (release === selectedRelease) {
            actionLabel = 'Selected'
          }
        } else {
          actionLabel = 'Download'
          if (release.progress) {
            actionLabel = 'Downloading'
          }
        }

        return (
          <StyledListItem
            key={i}
            button
            onClick={() => {
              this.handleReleaseSelected(release)
            }}
            selected={release === selectedRelease}
            isDownloading={!!release.progress}
          >
            <ListItemIcon>{renderIcon(release)}</ListItemIcon>
            <ListItemTextVersion
              primary={this.releaseName(release)}
              isLocalRelease={this.isLocalRelease(release)}
              secondary={release.progress > 0 ? `${release.progress}%` : null}
            />
            <StyledListItemAction>
              <Typography variant="button" color="primary">
                {actionLabel}
              </Typography>
            </StyledListItemAction>
          </StyledListItem>
        )
      })
      return list
    }
    return <StyledList>{renderListItems()}</StyledList>
  }

  render() {
    const { downloadError } = this.state
    return (
      <VersionListContainer>
        {this.renderVersionsAvailable()}
        {this.renderVersionList()}
        {downloadError && <StyledError>{downloadError}</StyledError>}
      </VersionListContainer>
    )
  }
}

const StyledList = styled(List)`
  max-height: 200px;
  max-width: 400px;
  overflow: scroll;
`

const VersionListContainer = styled.div`
  margin-bottom: 20px;
`

const ListItemTextVersion = styled(({ isLocalRelease, children, ...rest }) => (
  <ListItemText
    {...rest}
    primaryTypographyProps={{
      style: { color: isLocalRelease ? 'black' : 'grey' }
    }}
  >
    {children}
  </ListItemText>
))`
  text-transform: capitalize;
  ${props =>
    props.isLocalRelease &&
    css`
      font-weight: bold;
      color: grey;
    `}
`

const StyledListItemAction = styled.span`
  text-transform: uppercase;
`

const RemoteReleaseLoadingSpinner = styled(Spinner)`
  margin-left: 10px;
`

const StyledListItem = styled(without('isDownloading')(ListItem))`
${props =>
  !props.selected &&
  css`
    background: red;
    ${StyledListItemAction} {
      visibility: hidden;
    }
  `}
  &:hover ${StyledListItemAction} {
    visibility: visible;
  }
  ${props =>
    props.isDownloading &&
    css`
      ${StyledListItemAction} {
        visibility: visible;
      }
    `}
`

const StyledError = styled.div`
  color: red;
`

const BlankIconPlaceholder = styled.div`width: 24px; height; 24px`

const ToggableTypography = styled(Typography)`
  user-select: none;
  &:hover {
    cursor: pointer;
  }
`
