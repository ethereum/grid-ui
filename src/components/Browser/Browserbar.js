import React, { Component } from 'react'

import {Helpers, i18n, Mist} from '../../API'
import { Identicon } from 'ethereum-react-components'
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
    if (event.key === 'Enter') {
      this.props.onUrlChanged(this.state.value)
    }
  }
  render() {
    return (
      <form className="" action="about:blank" target="dapp-form-helper-iframe" autoComplete="on">
        <div className="url-input-2" >
          <input type="text" value={this.state.value} onChange={this.handleChange} onKeyDown={this.handleKeyDown}/>
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
    this.props.onReload()
  }
  handleAccountClick = () => {
    let url = this.props.url
    Mist.connectAccount({
      url: url
    })
  }
  renderAccounts(){
    let tab = this.props.selectedTab
    let dappAccounts = this.props.dappAccounts
    return dappAccounts.map(acc => 
      <span key={acc.address} className="simptip-position-left simptip-movable" data-tooltip={tab.name}>
        <Identicon seed={acc.address} className="dapp-tiny" />
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
    let icon = tab && tab.icon
    let nameFull = 'fullName'
    let name = tab && tab.name
    let dappAccounts = this.props.dappAccounts
    
    return (
      <div className="browser-bar">
        <button title="go back" className="back icon icon-arrow-left" onClick={this.handleGoBackClick}></button>
        <button title="refresh page" className="reload icon icon-refresh" onClick={this.handleReloadClick}></button>
        <div className="app-bar">
          <label htmlFor="url-input" className={"dapp-info " + (icon && 'has-icon')}>
            {icon && <img alt="app icon" src={icon} className="app-icon" />}
            <span title={nameFull}>{name}</span>
          </label>
          {false
          ? <UrlInputBreadcrumb url={this.props.url} />
          : <UrlInput url={this.props.url} onUrlChanged={this.props.onUrlChanged}/>
          }
          <button className="accounts" onClick={this.handleAccountClick}>
            {dappAccounts.length > 0 ? this.renderAccounts() : this.renderConnectButton() }
          </button>
        </div>
      </div>
    )
  }
}