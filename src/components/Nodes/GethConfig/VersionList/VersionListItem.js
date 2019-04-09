import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import Typography from '@material-ui/core/Typography'
import { without } from '../../../../lib/utils'
import Spinner from '../../../shared/Spinner'

export default class VersionListItem extends Component {
  static displayName = 'VersionListItem'

  static propTypes = {
    handleReleaseSelected: PropTypes.func,
    isSelectedRelease: PropTypes.func,
    isLocalRelease: PropTypes.func,
    fileName: PropTypes.string,
    name: PropTypes.string,
    progress: PropTypes.number
  }

  static defaultProps = {}

  releaseDisplayName = () => {
    const { fileName } = this.props
    const nameParts = fileName.split('-')

    if (nameParts[1] === 'darwin') {
      return `${nameParts[0]} ${nameParts[1]} ${nameParts[3]}`
    }

    return `${nameParts[0]} ${nameParts[1]} ${nameParts[3]} - ${nameParts[2]}`
  }

  renderIcon = () => {
    const { isLocalRelease, isSelectedRelease, progress } = this.props

    let icon = <BlankIconPlaceholder />
    if (progress) {
      icon = <Spinner size={20} value={progress} variant="determinate" />
    } else if (!isLocalRelease()) {
      icon = <CloudDownloadIcon color="primary" />
    } else if (isSelectedRelease()) {
      icon = <CheckBoxIcon color="primary" />
    } else if (isLocalRelease()) {
      icon = <HiddenCheckBoxIcon color="primary" />
    }
    return icon
  }

  render() {
    const {
      handleReleaseSelected,
      isLocalRelease,
      isSelectedRelease,
      name,
      progress
    } = this.props

    let actionLabel
    if (isLocalRelease()) {
      actionLabel = 'Use'
      if (isSelectedRelease()) {
        actionLabel = 'Selected'
      }
    } else {
      actionLabel = 'Download'
      if (progress) {
        actionLabel = 'Downloading'
      }
    }

    return (
      <StyledListItem
        button
        onClick={() => handleReleaseSelected()}
        selected={isSelectedRelease()}
        isDownloading={!!progress}
        alt={name}
      >
        <ListItemIcon>{this.renderIcon()}</ListItemIcon>
        <ListItemTextVersion
          primary={this.releaseDisplayName()}
          isLocalRelease={isLocalRelease()}
          secondary={progress >= 0 ? `${progress}%` : null}
        />
        <StyledListItemAction>
          <Typography variant="button" color="primary">
            {actionLabel}
          </Typography>
        </StyledListItemAction>
      </StyledListItem>
    )
  }
}

const HiddenCheckBoxIcon = styled(CheckBoxIcon)`
  visibility: hidden;
`

const StyledListItemAction = styled.span`
  text-transform: uppercase;
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

const BlankIconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
`
