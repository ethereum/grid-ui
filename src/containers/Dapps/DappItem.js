import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './DappItem.css'

export default class DappItem extends Component {
  static propTypes = {
    dapp: PropTypes.any
  }

  render() {
    const { dapp } = this.props

    let name = dapp.name || ''
    if (name === '' || name === undefined) {
      name = dapp.url
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
    }
    return (
      <article className="card">
        <header className="card-title">
          <h3>{name}</h3>
        </header>
        <figure className="card-thumbnail">
          <img alt="dapp banner" src={dapp.banner} />
        </figure>
        <div className="card-description">{dapp.description}</div>
        <Link
          to={`/browser/${encodeURIComponent(dapp.url)}`}
          className="button"
        >
          Launch
        </Link>
      </article>
    )
  }
}
