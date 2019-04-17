import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import semver from 'semver'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import RefreshIcon from '@material-ui/icons/Refresh'
import WarningIcon from '@material-ui/icons/Warning'
import amber from '@material-ui/core/colors/amber'
import Spinner from '../../shared/Spinner'
import { Mist } from '../../../API'
import { without } from '../../../lib/utils'
import { setRelease } from '../../../store/client/actions'

const { geth } = Mist

const lightGrey = 'rgba(0,0,0,0.25)'

const styles = () => ({
  refreshIcon: {
    fontSize: 22,
    color: lightGrey,
    marginLeft: 5,
    verticalAlign: 'middle',
    marginBottom: 4,
    visibility: 'hidden'
  },
  versionsAvailable: {
    '&:hover': {
      cursor: 'pointer'
    },
    '&:hover $refreshIcon': {
      visibility: 'visible'
    }
  },
  warning: {
    backgroundColor: amber[700],
    opacity: 0.9,
    margin: '10px 0 15px 0'
  },
  warningIcon: {
    fontSize: 19,
    verticalAlign: 'middle',
    marginBottom: 2
  }
})

class VersionList extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    client: PropTypes.object,
    classes: PropTypes.object
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

  releaseDisplayName = release => {
    const { fileName } = release
    const nameParts = fileName.split('-')
    const name = `${nameParts[0]} ${nameParts[1]} ${nameParts[3]}`
    return name
  }

  componentDidMount = async () => {
    this.loadLocalReleases()
    this.loadRemoteReleases()
  }

  loadLocalReleases = async selectedRelease => {
    const releases = await geth.getLocalBinaries()
    const localReleases = releases.filter(this.excludeUnstableReleases)
    this.setState({ localReleases })
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
      .filter(this.excludeAlreadyInstalledReleases)
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

  isLocalRelease = release => {
    return !release.location.includes('https://', 0)
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
    this.setState({ remoteReleases })
    // Reload local with selectedRelease
    this.loadLocalReleases(release)
  }

  renderVersionsAvailable = () => {
    const { classes } = this.props
    const { localReleases, loadingRemoteReleases } = this.state
    const releases = this.allReleases()

    if (releases.length === 0) {
      return <Spinner style={{ margin: '20px 0' }} />
    }

    return (
      <div>
        {loadingRemoteReleases && (
          <Typography variant="h6">
            Loading versions...
            <RemoteReleaseLoadingSpinner size={18} thickness={4} />
          </Typography>
        )}
        {!loadingRemoteReleases && (
          <Typography
            variant="h6"
            onClick={this.handleRefresh}
            classes={{ root: classes.versionsAvailable }}
          >
            {releases.length} versions available
            <RefreshIcon classes={{ root: classes.refreshIcon }} />
          </Typography>
        )}
        <Typography>
          <StyledDownloadedVersions>
            {localReleases.length} versions downloaded
          </StyledDownloadedVersions>
        </Typography>
      </div>
    )
  }

  handleRefresh = () => {
    this.loadRemoteReleases()
  }

  renderWarnings = () => {
    return <div>{this.renderLatestVersionWarning()}</div>
  }

  renderLatestVersionWarning = () => {
    const { classes, client } = this.props
    const { remoteReleases } = this.state
    const { release } = client
    if (!release || !remoteReleases.length) {
      return null
    }
    const latestRelease = this.allReleases()[0]
    const latestVersion = latestRelease.version
    const selectedVersion = release.version
    if (semver.compare(selectedVersion, latestVersion)) {
      return (
        <SnackbarContent
          classes={{ root: classes.warning }}
          message={
            <span>
              <WarningIcon classes={{ root: classes.warningIcon }} /> You are
              using an older version of Geth ({selectedVersion})<br />
              New releases contain performance and security enhancements.
            </span>
          }
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

  renderVersionList = () => {
    const releases = this.allReleases()
    const renderIcon = release => {
      let icon = <BlankIconPlaceholder />
      if (release.progress) {
        icon = (
          <Spinner variant="determinate" size={20} value={release.progress} />
        )
      } else if (!this.isLocalRelease(release)) {
        icon = <CloudDownloadIcon color="primary" />
      } else if (this.isSelectedRelease(release)) {
        icon = <CheckBoxIcon color="primary" />
      } else if (this.isLocalRelease(release)) {
        icon = <HiddenCheckBoxIcon color="primary" />
      }
      return icon
    }
    const renderListItems = () => {
      const list = releases.map((release, i) => {
        let actionLabel
        if (this.isLocalRelease(release)) {
          actionLabel = 'Use'
          if (this.isSelectedRelease(release)) {
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
            selected={this.isSelectedRelease(release)}
            isDownloading={!!release.progress}
            alt={release.name}
          >
            <ListItemIcon>{renderIcon(release)}</ListItemIcon>
            <ListItemTextVersion
              primary={this.releaseDisplayName(release)}
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
      <div>
        {this.renderVersionsAvailable()}
        {this.renderWarnings()}
        {this.renderVersionList()}
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

export default connect(mapStateToProps)(withStyles(styles)(VersionList))

const StyledList = styled(List)`
  max-height: 200px;
  max-width: 500px;
  overflow: scroll;
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

const HiddenCheckBoxIcon = styled(CheckBoxIcon)`
  visibility: hidden;
`

const StyledListItem = styled(without('isDownloading')(ListItem))`
${props =>
  !props.selected &&
  css`
    ${StyledListItemAction} {
      visibility: hidden;
    }
  `}
  &:hover ${StyledListItemAction} {
    visibility: visible;
  }
  &:hover ${HiddenCheckBoxIcon} {
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

const BlankIconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
`

const StyledDownloadedVersions = styled.span`
  color: lightGrey;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
`
