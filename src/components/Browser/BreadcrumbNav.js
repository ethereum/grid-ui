import React, { Component } from 'react'

class Breadcrumb extends Component {
  render() {
    const { url } = this.props

    const _url = new URL(url)
    // console.log(_url)

    // remove trailing '/'
    const pathname = _url.pathname.replace(/\/$/g, '')
    const pathParts = pathname.split('/')
    // remove all '?'
    const search = _url.search.replace(/\?/g, '')

    const parts = [_url.host, ...pathParts, search, _url.hash]
    return (
      <div className="url-breadcrumb">
        <span>
          {_url.protocol} '//'{' '}
          {parts.map((p, i) => (p ? <span key={i}>{p} ▸ </span> : ''))}
        </span>
      </div>
    )
  }
}

export default class UrlBreadcrumbInput extends Component {
  constructor(props) {
    super(props)

    this.state = { url: props.url }
  }

  handleChange = e => {
    this.setState({ url: e.target.value })
  }

  render() {
    const { url } = this.props

    let permissions = {
      admin: false
    }
    return (
      <form
        className="url"
        action="about:blank"
        target="dapp-form-helper-iframe"
        autoComplete="on"
      >
        {!permissions.admin && (
          <input
            className="url-input"
            id="url-input"
            type="text"
            value={url}
            onChange={this.handleChange}
          />
        )}
        <Breadcrumb url={url} />
      </form>
    )
  }
}
