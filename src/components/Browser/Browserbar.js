import React, { Component } from 'react'

import {Helpers, i18n, Mist, LocalStore} from '../../API'
import DappIdenticon from '../DappIdenticon'
import './Browserbar.css'
import UrlInputBreadcrumb from './BreadcrumbNav'

class UrlInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.url
    };

  }
  handleChange = (event) => {
    this.setState({value: event.target.value});
  }
  handleKeyDown = (event) => {
  }
  render() {
    return (
      <form className="" action="about:blank" target="dapp-form-helper-iframe" autoComplete="on">
        <div className="url-input-2" >
          <input type="text" value={this.props.url} onChange={this.handleChange} onKeyDown={this.handleKeyDown}/>
        </div>
      </form>
    )
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
          {false
          ? <UrlInputBreadcrumb url={this.props.url} />
          : <UrlInput url={this.props.url}/>
          }
          <button className="accounts" onClick={this.handleAccountClick}>
            {dappAccounts.length > 0 ? this.renderAccounts() : this.renderConnectButton() }
          </button>
        </div>
      </div>
    )
  }
}