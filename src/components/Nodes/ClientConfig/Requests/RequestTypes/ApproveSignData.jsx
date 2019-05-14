import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { Identicon } from 'ethereum-react-components'
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

  renderDetails() {
    const { request } = this.props
    const {
      content_type: contentType,
      address,
      raw_data: rawData,
      message,
      hash
    } = request.params[0]
    const { name, type, value } = message[0]
    const showMessage = name || type || value
    return (
      <div>
        <div>
          <strong>Address:</strong>
          <Identicon
            address="0xF5A5d5c30BfAC14bf207b6396861aA471F9A711D"
            size="small"
            style={{ verticalAlign: 'middle', margin: '5px 10px' }}
          />
          {address}
        </div>
        <div style={{ marginBottom: 10 }}>
          <strong>Content Type</strong>: {contentType}
        </div>
        {showMessage && (
          <div>
            <strong>Message:</strong>
            <div style={{ margin: '5px 0 15px 0', paddingLeft: 15 }}>
              <div style={{ marginBottom: 5 }}>
                <strong>Name:</strong> {name}
              </div>
              <div style={{ marginBottom: 5 }}>
                <strong>Type:</strong> {type}
              </div>
              <div style={{ marginBottom: 5 }}>
                <strong>Value:</strong> {value}
              </div>
            </div>
          </div>
        )}
        <div>
          <strong>Raw Data:</strong>
          <div>
            <TextField
              value={rawData}
              rowsMax={10}
              multiline
              disabled
              fullWidth
            />
          </div>
        </div>
        <div style={{ margin: '20px 0' }}>
          <strong>Hash:</strong> {hash}
        </div>
      </div>
    )
  }

  render() {
    const { request } = this.props
    return (
      <div>
        <Typography variant="h5" style={{ marginTop: 20 }}>
          Approve Sign Data
        </Typography>
        <RequestInfo request={request} />
        {this.renderDetails()}
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
