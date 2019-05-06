import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Notification from '../../../shared/Notification'
import { clearNotification } from '../../../../store/requests/actions'

class Notifications extends Component {
  static propTypes = {
    client: PropTypes.string,
    notifications: PropTypes.array,
    dispatch: PropTypes.func
  }

  onDismiss = index => {
    const { dispatch } = this.props
    dispatch(clearNotification(index))
  }

  render() {
    const { notifications, client } = this.props
    const clientNotifications = notifications.filter(
      notification => notification.client === client
    )
    const renderNotifications = []
    clientNotifications.forEach((notification, index) => {
      const renderNotification = (
        <Notification
          type={notification.type}
          message={notification.text}
          onDismiss={() => {
            this.onDismiss(index)
          }}
        />
      )
      renderNotifications.push(renderNotification)
    })

    return <div>{renderNotifications}</div>
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.requests.notifications
  }
}

export default connect(mapStateToProps)(Notifications)
