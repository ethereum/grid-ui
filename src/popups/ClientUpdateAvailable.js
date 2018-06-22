import React, { Component } from 'react'

class UrlInput extends Component {
  constructor(){
    super()

  }
  render() {
    let permissions = {
      admin: true
    }
    let url = 'www.google.com'
    let breadcrumb = <span>{url}</span>
    return (
      <form className="url" action="about:blank" target="dapp-form-helper-iframe" autoComplete="on">
        {permissions.admin 
        ? <input className="url-input" id="url-input" type="text" readOnly="true" value={url} />
        : <div className="url-breadcrumb" >{breadcrumb}</div>
        }
      </form>
    );
  }
}