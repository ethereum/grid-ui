import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import IconButton from '@material-ui/core/IconButton'
import InputRequired from './InputRequired'
import ApproveListing from './ApproveListing'
import ApproveNewAccount from './ApproveNewAccount'
import ApproveTx from './ApproveTx'
import ApproveSignData from './ApproveSignData'
import { selectRequest } from '../../../../store/requests/actions'
import Clef from '../../../../store/requests/clefService'

const styles = () => ({})

class Requests extends Component {
  static propTypes = {
    requests: PropTypes.object,
    dispatch: PropTypes.func,
    client: PropTypes.string
  }

  navigateNext = () => {
    const { dispatch, requests } = this.props
    const { selectedIndex, queue } = requests
    let next = selectedIndex + 1
    if (next > queue.length - 1) {
      // To beginning of queue
      next = 0
    }
    dispatch(selectRequest(next))
  }

  navigatePrevious = () => {
    const { dispatch, requests } = this.props
    const { selectedIndex, queue } = requests
    let previous = selectedIndex - 1
    if (previous < 0) {
      // To end of queue
      previous = queue.length - 1
    }
    dispatch(selectRequest(previous))
  }

  send = (method, params, id, result) => {
    const { client, dispatch } = this.props
    switch (client) {
      case 'clef':
        Clef.send(dispatch, method, params, id, result)
        break
      default:
        break
    }
  }

  renderControls() {
    const { requests } = this.props
    const { queue, selectedIndex } = requests
    if (queue.length < 2) {
      return null
    }
    let queueLocation
    if (queue.length > 1) {
      const currentRequest = selectedIndex + 1
      queueLocation = (
        <Typography inline>
          {currentRequest} of {queue.length}
        </Typography>
      )
    }
    return (
      <div>
        <div>
          <IconButton
            onClick={() => {
              this.navigatePrevious()
            }}
          >
            <NavigateBeforeIcon />
          </IconButton>
          {queueLocation}
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
    const { requests } = this.props
    const { queue, selectedIndex } = requests
    const request = queue[selectedIndex]
    if (!request) {
      return null
    }
    const { id, method } = request
    switch (method) {
      case 'ui_onInputRequired':
        return <InputRequired key={id} request={request} send={this.send} />
      case 'ui_approveListing':
        return <ApproveListing key={id} request={request} send={this.send} />
      case 'ui_approveNewAccount':
        return <ApproveNewAccount key={id} request={request} send={this.send} />
      case 'ui_approveTx':
        return <ApproveTx key={id} request={request} send={this.send} />
      case 'ui_approveSignData':
        return <ApproveSignData key={id} request={request} send={this.send} />
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
    requests: state.requests
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Requests))
