import React, { Component } from 'react'
import PropTypes from 'prop-types'
import InputRequired from './RequestTypes/InputRequired'
import ApproveListing from './RequestTypes/ApproveListing'
import ApproveNewAccount from './RequestTypes/ApproveNewAccount'
import ApproveTx from './RequestTypes/ApproveTx'
import ApproveSignData from './RequestTypes/ApproveSignData'

class Request extends Component {
  propTypes = {
    request: PropTypes.object,
    send: PropTypes.func
  }

  render() {
    const { request, send } = this.props
    const { id, method } = request
    switch (method) {
      case 'ui_onInputRequired':
        return <InputRequired key={id} request={request} send={send} />
      case 'ui_approveListing':
        return <ApproveListing key={id} request={request} send={send} />
      case 'ui_approveNewAccount':
        return <ApproveNewAccount key={id} request={request} send={send} />
      case 'ui_approveTx':
        return <ApproveTx key={id} request={request} send={send} />
      case 'ui_approveSignData':
        return <ApproveSignData key={id} request={request} send={send} />
      default:
        console.error('No handler for clef method: ', method)
        return null
    }
  }
}

export default Request
