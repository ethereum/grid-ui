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
    plugin: PropTypes.object.isRequired,
    release: PropTypes.object.isRequired,
    handleDownloadError: PropTypes.func.isRequired,
    handleReleaseDownloaded: PropTypes.func.isRequired,
    handleReleaseSelect: PropTypes.func,
    isSelectedRelease: PropTypes.func
  }

  state = {
    isDownloading: false,
    downloadProgress: 0,
    extractionProgress: 0,
    extractedFile: '',
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
    const { plugin } = this.props
    const { displayName } = plugin
    const { platform, arch, displayVersion } = release
    return `${displayName} ${displayVersion} - ${platform} (${arch})`
  }

  downloadRelease = release => {
    const { plugin, handleDownloadError, handleReleaseDownloaded } = this.props
    const { isDownloading } = this.state
    // Return if already downloading
    if (isDownloading) return
    this.setState({ isDownloading: true }, async () => {
      let localRelease
      try {
        localRelease = await plugin.download(
          release,
          downloadProgress => {
            if (this._isMounted) this.setState({ downloadProgress })
          },
          (extractionProgress, extractedFile) => {
            if (this._isMounted) {
              this.setState({ extractionProgress, extractedFile })
            }
          }
        )
      } catch (error) {
        handleDownloadError(error)
      }
      if (this._isMounted) {
        this.setState({
          isDownloading: false,
          downloadProgress: 0,
          extractionProgress: 0,
          extractedFile: ''
        })
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
    const {
      downloadProgress,
      isDownloading,
      extractionProgress,
      isHovered
    } = this.state
    let icon = <BlankIconPlaceholder />
    if (isDownloading) {
      icon = (
        <Spinner
          variant="determinate"
          size={20}
          value={extractionProgress || downloadProgress}
        />
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
    const {
      downloadProgress,
      isDownloading,
      extractionProgress,
      extractedFile
    } = this.state

    let actionLabel = 'Use'
    if (!release.remote) {
      actionLabel = 'Use'
      if (isSelectedRelease(release)) {
        actionLabel = 'Selected'
      }
    } else {
      actionLabel = 'Download'
      if (isDownloading) {
        actionLabel = extractionProgress > 0 ? 'Extracting' : 'Downloading'
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
          secondary={
            // eslint-disable-next-line no-nested-ternary
            extractionProgress > 0
              ? `${extractionProgress}% - ${extractedFile}`
              : downloadProgress > 0
              ? `${downloadProgress}%`
              : null
          }
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
