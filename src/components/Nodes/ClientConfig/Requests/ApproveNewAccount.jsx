import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import RequestInfo from './RequestInfo'

const styles = () => ({
  controls: { marginTop: 15 },
  approve: { backgroundColor: 'green' },
  reject: { backgroundColor: 'red', marginRight: 10 }
})

class ApproveListing extends Component {
  static propTypes = {
    request: PropTypes.object,
    classes: PropTypes.object,
    send: PropTypes.func
  }

  submit(approved) {
    const { request, send } = this.props
    const { id } = request
    const result = { approved }
    send(null, [], id, result)
  }

  renderControls() {
    const { classes } = this.props
    return (
      <div classes={{ root: classes.controls }}>
        <Button
          onClick={() => {
            this.submit(false)
          }}
          classes={{ root: classes.reject }}
        >
          Reject
        </Button>
        <Button
          onClick={() => {
            this.submit(true)
          }}
          classes={{ root: classes.approve }}
        >
          Approve
        </Button>
      </div>
    )
  }

  render() {
    const { request } = this.props
    return (
      <div>
        <Typography variant="h2">Approve New Account</Typography>
        <RequestInfo request={request} />
        {this.renderControls()}
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(withStyles(styles)(ApproveListing))
