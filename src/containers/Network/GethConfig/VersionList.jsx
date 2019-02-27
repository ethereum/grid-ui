import React, { Component } from 'react'
import { Spinner } from 'ethereum-react-components'
import styled, { css } from 'styled-components'
import semver from 'semver'
import * as debugModule from 'debug'

import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

import { Mist } from '../../../API'

const { geth } = Mist
const debug = debugModule('GethConfig')

// calling styled(without('unneededProp')(TheComponent))
// helps satisfy error of extra StyledComponents props passing into children
// see: https://github.com/styled-components/styled-components/pull/2093#issuecomment-461510706
const without = (...omitProps) => {
  const omitSingle = (object = {}, key) => {
    if (key === null || key === undefined || !(key in object)) return object
    const { [key]: deleted, ...otherKeys } = object
    return otherKeys
  }

  const omit = (object = {}, keys) => {
    if (!keys) return object
    if (Array.isArray(keys)) {
      // calling omitMultiple here would result in a second array check
      return keys.reduce((result, key) => {
        if (key in result) {
          return omitSingle(result, key)
        }
        return result
      }, object)
    }
    return omitSingle(object, keys)
  }
  // HoF
  return C => {
    const WithoutPropsComponent = ({ children, ...props }) => {
      return React.createElement(C, omit(props, omitProps), children)
    }
    return WithoutPropsComponent
  }
}

export default class GethConfig extends Component {
  state = {
    localReleases: [],
    remoteReleases: [],
    selectedRelease: null,
    loadingRemoteReleases: false,
    downloadError: null
  }

  noUnstableReleases = release => !release.fileName.includes('unstable')

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

  loadLocalReleases = async () => {
    const releases = await geth.getLocalBinaries()
    const localReleases = releases.filter(this.noUnstableReleases)
    const selectedRelease = localReleases[0]
    this.setState({ localReleases, selectedRelease })
  }

  loadRemoteReleases = async () => {
    this.setState({ loadingRemoteReleases: true })
    const releases = await geth.getReleases()
    const remoteReleases = releases.filter(this.noUnstableReleases)
    debug('Fetched remote releases: ', remoteReleases)
    this.setState({ remoteReleases })
    this.setState({ loadingRemoteReleases: false })
  }

  handleReleaseSelected = selectedRelease => {
    if (this.isLocalRelease(selectedRelease)) {
      this.setState({ selectedRelease })
    } else {
      debug('Download release: ', selectedRelease)
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
    if (release.progress > 0) {
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
      debug('Download Error: ', error)
    }
    delete remoteReleases[index].progress
    const selectedRelease = release
    this.setState({ remoteReleases, selectedRelease })
  }

  renderVersionsAvailable = () => {
    const { localReleases, loadingRemoteReleases } = this.state
    const releases = this.allReleases()
    if (releases.length === 0) {
      return null
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
          <Typography variant="h6">
            {releases.length} versions available
          </Typography>
        )}
        <Typography variant="subtitle1" gutterBottom>
          {localReleases.length} versions downloaded
        </Typography>
      </div>
    )
  }

  renderVersionList = () => {
    const { selectedRelease } = this.state
    const releases = this.allReleases()
    const renderIcon = release => {
      let icon = <BlankIconPlaceholder />
      if (release.progress) {
        icon = <Spinner size={20} />
      } else if (!this.isLocalRelease(release)) {
        icon = <CloudDownloadIcon color="primary" />
      } else if (release === selectedRelease) {
        icon = <CheckBoxIcon />
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
              <Typography
                variant="button"
                color={selectedRelease === release ? 'default' : 'primary'}
              >
                {actionLabel}
              </Typography>
            </StyledListItemAction>
          </StyledListItem>
        )
      })
      return list
    }
    return (
      <VersionListContainer>
        <VersionList>{renderListItems()}</VersionList>
      </VersionListContainer>
    )
  }

  renderDownloadError() {
    const { downloadError } = this.state
    if (!downloadError) {
      return null
    }

    return <StyledError>{downloadError}</StyledError>
  }

  render() {
    return (
      <div>
        {this.renderVersionsAvailable()}
        {this.renderVersionList()}
        {this.renderDownloadError()}
      </div>
    )
  }
}

const VersionList = styled(List)`
  max-height: 200px;
  max-width: 400px;
  overflow: scroll;
`

const VersionListContainer = styled.div`
  margin-bottom: 40px;
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
  ${StyledListItemAction} {
    visibility: hidden;
  }
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
