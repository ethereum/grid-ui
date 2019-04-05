import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import RefreshIcon from '@material-ui/icons/Refresh'
import Spinner from '../../../shared/Spinner'

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
  }
})

class AvailableVersionText extends Component {
  static displayName = 'AvailableVersionText'

  static propTypes = {
    classes: PropTypes.any,
    getAllReleases: PropTypes.func,
    localReleases: PropTypes.array,
    loadRemoteReleases: PropTypes.func,
    loadingRemoteReleases: PropTypes.array
  }

  static defaultProps = {}

  render() {
    const {
      classes,
      getAllReleases,
      localReleases,
      loadRemoteReleases,
      loadingRemoteReleases
    } = this.props
    const releases = getAllReleases()

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
            onClick={loadRemoteReleases}
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
}

export default withStyles(styles)(AvailableVersionText)

const RemoteReleaseLoadingSpinner = styled(Spinner)`
  margin-left: 10px;
`

const StyledDownloadedVersions = styled.span`
  color: lightGrey;
  font-size: 13px;
  font-weight: bold;
  text-transform: uppercase;
`
