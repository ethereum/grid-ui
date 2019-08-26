import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import semver from 'semver'
import { withStyles } from '@material-ui/core/styles'
import WarningIcon from '@material-ui/icons/Warning'
import amber from '@material-ui/core/colors/amber'

const styles = () => ({
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

class LatestVersionWarning extends Component {
  static propTypes = {
    classes: PropTypes.object,
    displayName: PropTypes.string,
    latestRelease: PropTypes.object,
    selectedVersion: PropTypes.string,
    handleReleaseSelect: PropTypes.func.isRequired
  }

  static defaultProps = {}

  render() {
    const {
      classes,
      handleReleaseSelect,
      latestRelease,
      selectedVersion,
      displayName
    } = this.props
    if (!selectedVersion || !latestRelease) return null
    const latestVersion = latestRelease.version

    if (semver.compare(selectedVersion, latestVersion)) {
      return (
        <SnackbarContent
          classes={{ root: classes.warning }}
          message={
            <span>
              <WarningIcon classes={{ root: classes.warningIcon }} /> You are
              using an older version of {displayName}
            </span>
          }
          action={
            <Button onClick={() => handleReleaseSelect(latestRelease)}>
              Use {latestVersion.split('-')[0]}
            </Button>
          }
        />
      )
    }

    return null
  }
}

export default withStyles(styles)(LatestVersionWarning)
