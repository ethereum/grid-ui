import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import IconButton from '@material-ui/core/IconButton'
import InputRequired from './requests/InputRequired'
import ApproveListing from './requests/ApproveListing'
import ApproveNewAccount from './requests/ApproveNewAccount'
import { selectRequest } from '../../store/signer/actions'

const styles = () => ({})

class RequestQueue extends Component {
  static propTypes = {
    signer: PropTypes.object,
    dispatch: PropTypes.func
  }

  navigateNext = () => {
    const { dispatch, signer } = this.props
    const { selectedRequest, requests } = signer
    let next = selectedRequest + 1
    if (next > requests.length - 1) {
      // To beginning of queue
      next = 0
    }
    dispatch(selectRequest({ index: next }))
  }

  navigatePrevious = () => {
    const { dispatch, signer } = this.props
    const { selectedRequest, requests } = signer
    let previous = selectedRequest - 1
    if (previous < 0) {
      // To end of queue
      previous = requests.length - 1
    }
    dispatch(selectRequest({ index: previous }))
  }

  renderControls() {
    const { signer } = this.props
    const { requests, selectedRequest } = signer
    if (requests.length < 2) {
      return null
    }
    let queueLocation
    if (requests.length > 1) {
      const currentRequest = selectedRequest + 1
      queueLocation = (
        <Typography>
          {currentRequest} of {requests.length}
        </Typography>
      )
    }
    return (
      <div>
        {queueLocation}
        <div>
          <IconButton
            onClick={() => {
              this.navigatePrevious()
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              this.navigateNext()
            }}
          >
            <NavigateNextIcon />
          </IconButton>
        </div>
      </div>
    )
  }

  renderRequest() {
    const { signer } = this.props
    const { requests, selectedRequest } = signer
    const request = requests[selectedRequest]
    if (!request) {
      return null
    }
    const { id, method } = request
    switch (method) {
      case 'ui_onInputRequired':
        return <InputRequired key={id} request={request} />
      case 'ui_approveListing':
        return <ApproveListing key={id} request={request} />
      case 'ui_approveNewAccount':
        return <ApproveNewAccount key={id} request={request} />
      default:
        console.error('No handler for clef method: ', method)
        return null
    }
  }

  render() {
    return (
      <div>
        {this.renderControls()}
        {this.renderRequest()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    signer: state.signer
  }
}

export default connect(mapStateToProps)(withStyles(styles)(RequestQueue))
