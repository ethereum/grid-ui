import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import '../normalize.css'

import DappItem from './DappItem'

class DappOverview extends Component {
  static propTypes = {
    suggestedDapps: PropTypes.any,
    tabs: PropTypes.any
  }

  render() {
    const { suggestedDapps: suggested, tabs: connectedDapps } = this.props

    return (
      <main className="dapps">
        <h1>
          <strong>Dapps</strong> Overview
        </h1>

        <h2>Connected</h2>
        <section className="card-container dapps">
          {connectedDapps.map((dapp, idx) => {
            dapp.banner =
              dapp.banner ||
              'https://www.sols.org/components/com_easyblog/themes/wireframe/images/placeholder-image.png'
            return <DappItem dapp={dapp} key={idx} />
          })}
        </section>

        <h2>Suggested</h2>
        <section className="card-container dapps">
          {suggested.map(dapp => {
            return <DappItem dapp={dapp} key={dapp.name} />
          })}
        </section>
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    tabs: state.tabs,
    suggestedDapps: state.suggestedDapps
  }
}

export default withRouter(connect(mapStateToProps)(DappOverview))
