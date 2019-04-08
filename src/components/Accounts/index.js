import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'
import Terminal from '../shared/Terminal'
import { Grid } from '../../API'

const { clef } = Grid

const styles = () => ({
  status: {},
  statusIconDot: {
    verticalAlign: 'middle',
    color: 'red'
  },
  isRunning: {
    color: 'green'
  }
})

class Accounts extends Component {
  static propTypes = {
    // signer: PropTypes.object,
    classes: PropTypes.object
  }

  // constructor(props) {
  //   super(props)
  // }

  handleStartStop() {
    const { isRunning } = clef
    if (isRunning) {
      clef.stop()
    } else {
      clef.start()
    }
  }

  renderStartStop() {
    // const { classes } = this.props
    const { isRunning } = clef
    return (
      <Button onClick={this.handleStartStop}>
        {isRunning ? 'Stop' : 'Start'}
      </Button>
    )
  }

  renderStatus() {
    const { classes } = this.props
    const { isRunning } = clef
    const dotClasses = isRunning
      ? classNames(classes.statusIconDot, classes.isRunning)
      : classes.statusIconDot

    return (
      <span>
        <Typography component="h5" classes={{ root: classes.status }}>
          <FiberManualRecordIcon classes={{ root: dotClasses }} />
          {isRunning ? 'Running' : 'Not Running'}
        </Typography>
      </span>
    )
  }

  renderDownloadProgress() {
    let downloadProgress = null
    const onProgress = progress => {
      downloadProgress = progress
    }
    clef.on('downloadProgress', onProgress)
    if (downloadProgress === 100) {
      downloadProgress = null
    }
    if (downloadProgress) {
      return <Typography>Download Progress: {downloadProgress}%</Typography>
    }
    return null
  }

  render() {
    return (
      <div>
        <Typography component="h1">Accounts</Typography>
        {this.renderDownloadProgress()}
        {this.renderStatus()}
        {this.renderStartStop()}
        {!!clef.getLogs().length && <Terminal type="clef" />}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    signer: state.signer
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Accounts))
