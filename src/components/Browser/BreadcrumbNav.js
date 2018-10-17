import React, { Component } from 'react'

class Breadcrumb extends Component {
  render() {
    let _url = new URL(this.props.url)
    // console.log(_url)

    // remove trailing '/'
    let pathname = _url.pathname.replace(/\/$/g, '')
    let pathParts = pathname.split('/')
    // remove all '?'
    let search = _url.search.replace(/\?/g, '')

    let parts = [_url.host, ...pathParts, search, _url.hash]
    return (
      <div className="url-breadcrumb" >
        <span>
          {_url.protocol} '//' {parts.map((p, i) => p ? <span key={i}>{p}  ▸ </span> : '')}
        </span>
      </div>
    )
  }
}

export default class UrlBreadcrumbInput extends Component {
  constructor(props){
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.state = {url: props.url}
  }
  handleChange(e){
    this.setState({url: e.target.value})
  }
  render() {
    let permissions = {
      admin: false
    }
    return (
      <form className="url" action="about:blank" target="dapp-form-helper-iframe" autoComplete="on">
        {!permissions.admin && <input className="url-input" id="url-input" type="text" value={this.props.url} onChange={this.handleChange}/> }
        <Breadcrumb url={this.props.url}/>
      </form>
    );
  }
}