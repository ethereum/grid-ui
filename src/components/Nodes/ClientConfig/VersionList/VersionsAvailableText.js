import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import RefreshIcon from '@material-ui/icons/Refresh'
import Spinner from '../../../shared/Spinner'

const styles = () => ({
  refreshIcon: {
    fontSize: 22,
    color: 'rgba(0,0,0,0.25)',
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
  }
})

class VersionsAvailableText extends Component {
  static displayName = 'VersionsAvailableText'

  static propTypes = {
    classes: PropTypes.object,
    loadingReleases: PropTypes.bool,
    localReleaseCount: PropTypes.number,
    totalReleaseCount: PropTypes.number,
    lastLoadTimestamp: PropTypes.number
  }

  render() {
    const {
      classes,
      loadingReleases,
      localReleaseCount,
      totalReleaseCount,
      lastLoadTimestamp
    } = this.props

    return (
      <div>
        {loadingReleases ? (
          <Typography variant="h6">
            Loading versions...
            <RemoteReleaseLoadingSpinner size={18} thickness={4} />
          </Typography>
        ) : (
          <Typography
            variant="h6"
            onClick={this.handleRefresh}
            classes={{ root: classes.versionsAvailable }}
            data-test-id="button-refresh-version-list"
            data-test-timestamp={lastLoadTimestamp}
          >
            {totalReleaseCount}{' '}
            {localReleaseCount === 1 ? 'version' : 'versions'} available
            <RefreshIcon classes={{ root: classes.refreshIcon }} />
          </Typography>
        )}

        <Typography>
          <StyledDownloadedVersions>
            {localReleaseCount}{' '}
            {localReleaseCount === 1 ? 'release' : 'releases'} downloaded
          </StyledDownloadedVersions>
        </Typography>
      </div>
    )
  }
}

export default withStyles(styles)(VersionsAvailableText)

const RemoteReleaseLoadingSpinner = styled(Spinner)`
  margin-left: 10px;
`

const StyledDownloadedVersions = styled.span`
  color: lightGrey;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
`
