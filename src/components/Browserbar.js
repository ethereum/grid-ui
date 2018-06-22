import React, { Component } from 'react'

// turn required globals into explicit dependencies
import {Helpers, LocalStore} from '../API'

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

export default class Browserbar extends Component {
  constructor(){
    super()
    this.icon = 'http://via.placeholder.com/15x15'
  }
  /**
   * Go back in the dapps browser history
   */
  handleGoBack(){
    var webview = Helpers.getWebview(LocalStore.get('selectedTab'));
    if (webview && webview.canGoBack()) {
      webview.goBack();
    }
  }
  render(){

    let nameFull = 'fullName'
    let name = 'name'

    return (
      <div className="browser-bar">
        <button title="go back" className="back icon icon-arrow-left" onClick={this.handleGoBack}></button>
        <button title="refresh page" className="reload icon icon-refresh"></button>
        <div className="app-bar">
          <label htmlFor="url-input" className={"dapp-info" + (this.icon && 'has-icon')}>
            {this.icon && <img src={this.icon} className="app-icon" />}
            <span title={nameFull}>{name}</span>
          </label>

          <UrlInput />

        </div>
      </div>
    )
  }
}