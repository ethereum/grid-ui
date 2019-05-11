import React, { Component } from 'react'
import PropTypes from 'prop-types'

class RequestInfo extends Component {
  static propTypes = {
    request: PropTypes.object
  }

  render() {
    const { request } = this.props
    if (!request.params[0]) {
      return null
    }
    const { meta } = request.params[0]
    if (!meta) {
      return null
    }
    const { remote, scheme, local, 'User-Agent': userAgent, Origin } = meta
    return (
      <div style={{ background: '#efefef', padding: 20, margin: 20 }}>
        <div>
          Remote: <strong>{remote}</strong>
        </div>
        <div>
          Transport: <strong>{scheme}</strong>
        </div>
        <div>
          Local Endpoint: <strong>{local}</strong>
        </div>
        {userAgent && (
          <div>
            User Agent: <strong>{userAgent}</strong>
          </div>
        )}
        {Origin && (
          <div>
            Origin: <strong>{Origin}</strong>
          </div>
        )}
      </div>
    )
  }
}

export default RequestInfo
