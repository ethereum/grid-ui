import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './DappItem.css'

export default class DappItem extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let dapp = this.props.dapp
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
        <img src={dapp.banner} />
      </figure>
      <div className="card-description">
        {dapp.description}
      </div>
      <Link to={`/browser/${encodeURIComponent(dapp.url)}`} className="button">
        Launch
      </Link>

    </article>
    )
  }
}