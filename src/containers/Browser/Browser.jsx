import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Browser from '../../components/Browser'

class BrowserView extends Component {
  static propTypes = {
    match: PropTypes.any
  }

  render() {
    const { match } = this.props

    return (
      <main>
        <h1>Browser</h1>
        <Browser match={match} />
      </main>
    )
  }
}

export default withRouter(BrowserView)
