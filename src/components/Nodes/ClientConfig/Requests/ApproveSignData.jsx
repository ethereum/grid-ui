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
    send: PropTypes.func,
    classes: PropTypes.object
  }

  submit(approved) {
    const { request, send } = this.props
    const { id } = request
    const result = { approved }
    const message = { id, result }
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

  renderDetails() {
    const { request } = this.props
    const {
      content_type: contentType,
      address,
      raw_data: rawData,
      message,
      hash
    } = request.params[0]
    const { name, type, value } = message
    const showMessage = name || type || value
    return (
      <div>
        <div>
          Content Type: <strong>{contentType}</strong>
        </div>
        <div>
          Address: <strong>{address}</strong>
        </div>
        {showMessage && (
          <div>
            Message:
            <div style={{ paddingLeft: 15 }}>
              Name: <strong>{message.name}</strong>
              Type: <strong>{message.type}</strong>
              Value: <strong>{message.value}</strong>
            </div>
          </div>
        )}
        <div>
          Raw Data: <strong>{rawData}</strong>
        </div>
        <div>
          Hash: <strong>{hash}</strong>
        </div>
      </div>
    )
  }

  render() {
    const { request } = this.props
    return (
      <div>
        <Typography variant="h2">Approve Sign Data</Typography>
        <RequestInfo request={request} />
        {this.renderDetails()}
        {this.renderControls()}
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(withStyles(styles)(ApproveListing))
