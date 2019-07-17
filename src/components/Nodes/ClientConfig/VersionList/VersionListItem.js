import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import styled, { css } from 'styled-components'
import Spinner from '../../../shared/Spinner'
import { without } from '../../../../lib/utils'

export default class VersionListItem extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    release: PropTypes.object.isRequired,
    handleDownloadError: PropTypes.func.isRequired,
    handleReleaseDownloaded: PropTypes.func.isRequired,
    handleReleaseSelect: PropTypes.func,
    isSelectedRelease: PropTypes.func
  }

  state = {
    isDownloading: false,
    downloadProgress: 0,
    isHovered: false
  }

  componentDidMount() {
    // @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
    this._isMounted = true
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  releaseDisplayName = release => {
    const { client } = this.props
    const { fileName } = release
    try {
      const nameParts = fileName.split('-')
      let name = nameParts[0]
      // fixes: "geth alltools" vs clef
      if (name !== client.displayName) {
        name = client.displayName
      }
      const osTypes = ['darwin', 'linux', 'windows']
      const os = nameParts.find(p => osTypes.includes(p)) || ''
      let arch = nameParts[2]
      if (os === 'windows') {
        arch = arch === '386' ? '32 Bit' : '64 Bit'
      }
      const version = nameParts.find(p => p.includes('.'))
      // const channel = nameParts[4]
      return `${name} ${os} ${version} (${arch})`
    } catch (error) {
      return fileName
    }
  }

  downloadRelease = release => {
    const { client, handleDownloadError, handleReleaseDownloaded } = this.props
    const { isDownloading } = this.state
    // Return if already downloading
    if (isDownloading) return
    this.setState({ isDownloading: true }, async () => {
      let localRelease
      try {
        localRelease = await client.download(release, downloadProgress => {
          if (this._isMounted) this.setState({ downloadProgress })
        })
      } catch (error) {
        handleDownloadError(error)
      }
      if (this._isMounted) {
        this.setState({ isDownloading: false, downloadProgress: 0 })
      }
      handleReleaseDownloaded(localRelease)
    })
  }

  handleReleaseSelect = release => {
    const { handleReleaseSelect } = this.props
    if (release.remote) {
      this.downloadRelease(release)
    } else {
      handleReleaseSelect(release)
    }
  }

  renderIcon = release => {
    const { isSelectedRelease } = this.props
    const { downloadProgress, isDownloading, isHovered } = this.state
    let icon = <BlankIconPlaceholder />
    if (isDownloading) {
      icon = (
        <Spinner variant="determinate" size={20} value={downloadProgress} />
      )
    } else if (release.remote) {
      icon = <CloudDownloadIcon color={isHovered ? 'primary' : 'inherit'} />
    } else if (isSelectedRelease(release)) {
      icon = <CheckBoxIcon color="primary" />
    } else if (!release.remote) {
      icon = <HiddenCheckBoxIcon color={isHovered ? 'primary' : 'inherit'} />
    }
    return icon
  }

  toggleHover = () => {
    const { isHovered } = this.state
    this.setState({ isHovered: !isHovered })
  }

  render() {
    const { isSelectedRelease, release } = this.props
    const { downloadProgress, isDownloading } = this.state

    let actionLabel = 'Use'
    if (!release.remote) {
      actionLabel = 'Use'
      if (isSelectedRelease(release)) {
        actionLabel = 'Selected'
      }
    } else {
      actionLabel = 'Download'
      if (isDownloading) {
        actionLabel = 'Downloading'
      }
    }

    return (
      <StyledListItem
        button
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        onClick={() => this.handleReleaseSelect(release)}
        selected={isSelectedRelease(release)}
        isDownloading={isDownloading}
        alt={release.name}
        data-test-is-selected={isSelectedRelease(release)}
        data-test-is-downloaded={!release.remote}
      >
        <ListItemIcon>{this.renderIcon(release)}</ListItemIcon>
        <ListItemTextVersion
          primary={this.releaseDisplayName(release)}
          isLocalRelease={!release.remote}
          secondary={downloadProgress > 0 ? `${downloadProgress}%` : null}
        />
        <StyledListItemAction>
          <Typography
            variant="button"
            color={isSelectedRelease ? 'primary' : 'inherit'}
          >
            {actionLabel}
          </Typography>
        </StyledListItemAction>
      </StyledListItem>
    )
  }
}

const StyledListItemAction = styled.span`
  text-transform: uppercase;
`

const ListItemTextVersion = styled(({ isLocalRelease, children, ...rest }) => (
  <ListItemText
    {...rest}
    primaryTypographyProps={{
      style: { opacity: isLocalRelease ? '1' : '.4' }
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

const HiddenCheckBoxIcon = styled(CheckBoxIcon)`
  visibility: hidden;
`

const BlankIconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
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
