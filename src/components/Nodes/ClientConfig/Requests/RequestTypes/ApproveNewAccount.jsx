import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import RequestInfo from './RequestInfo'
import RequestActions from './RequestActions'

const styles = () => ({})

class ApproveListing extends Component {
  static propTypes = {
    request: PropTypes.object,
    send: PropTypes.func
  }

  submit(approved) {
    const { request, send } = this.props
    const { id } = request
    const result = { approved }
    send(null, [], id, result)
  }

  render() {
    const { request } = this.props
    return (
      <div>
        <Typography variant="h2">Approve New Account</Typography>
        <RequestInfo request={request} />
        <RequestActions
          approve={() => this.submit(true)}
          reject={() => this.submit(false)}
        />
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(withStyles(styles)(ApproveListing))
