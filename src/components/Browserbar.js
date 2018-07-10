import React, { Component } from 'react'

// turn required globals into explicit dependencies
import {Helpers, i18n, Mist, LocalStore} from '../API'

import DappIdenticon from './DappIdenticon'

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
          {_url.protocol} // {parts.map((p, i) => p ? <span key={i}>{p}  ▸ </span> : '')}
        </span>
      </div>
    )
  }
}

class UrlBreadcrumbInput extends Component {
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

export default class Browserbar extends Component {
  constructor(props){
    super(props)
    this.handleReloadClick = this.handleReloadClick.bind(this)
  }
  /**
   * Go back in the dapps browser history
   */
  handleGoBackClick(){
    var webview = Helpers.getCurrentWebview()
    if (webview && webview.canGoBack()) {
      webview.goBack();
    }
  }
  /**
   * Reload the current webview
   * @event click button.reload 
   */
  handleReloadClick(){
    var webview = Helpers.getCurrentWebview()
    if (webview) {
      webview.reload()
    }
  }
  handleAccountClick() {
    Mist.requestAccount()
  }
  renderAccounts(){
    let tab = this.props.selectedTab
    let dappAccounts = this.props.dappAccounts
    return dappAccounts.map(acc => 
      <span key={acc.address} className="simptip-position-left simptip-movable" data-tooltip={tab.name}>
        <DappIdenticon identity={acc.address} className="dapp-tiny" />
      </span>
    )
  }
  renderConnectButton(){
    return (
      <span>
        <span className="connect-button">{i18n.t('mist.browserBar.buttons.connect')}</span>
        <span className="simptip-position-left simptip-movable no-accounts" data-tooltip={i18n.t('mist.browserBar.buttons.noAccounts')}></span>
      </span>
    )
  }
  render(){
    let tab = this.props.selectedTab
    let nameFull = 'fullName'
    let dappAccounts = this.props.dappAccounts
    
    return (
      <div className="browser-bar">
        <button title="go back" className="back icon icon-arrow-left" onClick={this.handleGoBackClick}></button>
        <button title="refresh page" className="reload icon icon-refresh" onClick={this.handleReloadClick}></button>
        <div className="app-bar">
          <label htmlFor="url-input" className={"dapp-info " + (tab.icon && 'has-icon')}>
            {tab.icon && <img src={tab.icon} className="app-icon" />}
            <span title={nameFull}>{tab.name}</span>
          </label>

          <UrlBreadcrumbInput url={this.props.url} />

          <button className="accounts" onClick={this.handleAccountClick}>
            {dappAccounts.length > 0 ? this.renderAccounts() : this.renderConnectButton() }
          </button>

        </div>
      </div>
    )
  }
}