import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Identicon } from 'ethereum-react-components'
import { Helpers, i18n, Mist } from '../../API'
import UrlInputBreadcrumb from './BreadcrumbNav'
import './Browserbar.css'

class UrlInput extends Component {
  static propTypes = {
    onUrlChanged: PropTypes.func,
    url: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      value: props.url
    }
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }

  handleKeyDown = event => {
    const { onUrlChanged } = this.props
    const { value } = this.state

    if (event.key === 'Enter') {
      onUrlChanged(value)
    }
  }

  render() {
    const { value } = this.state

    return (
      <form
        className=""
        action="about:blank"
        target="dapp-form-helper-iframe"
        autoComplete="on"
      >
        <div className="url-input-2">
          <input
            type="text"
            value={value}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
          />
        </div>
      </form>
    )
  }
}

export default class Browserbar extends Component {
  static propTypes = {
    onUrlChanged: PropTypes.func,
    url: PropTypes.any,
    onReload: PropTypes.any,
    selectedTab: PropTypes.any,
    dappAccounts: PropTypes.any
  }

  /**
   * Go back in the dapps browser history
   */
  handleGoBackClick = () => {
    const webview = Helpers.getCurrentWebview()
    if (webview && webview.canGoBack()) {
      webview.goBack()
    }
  }

  /**
   * Reload the current webview
   * @event click button.reload
   */
  handleReloadClick = () => {
    const { onReload } = this.props

    onReload()
  }

  handleAccountClick = () => {
    const { url } = this.props

    Mist.connectAccount({ url })
  }

  renderAccounts = () => {
    const { selectedTab: tab, dappAccounts } = this.props

    return dappAccounts.map(acc => (
      <span
        key={acc.address}
        className="simptip-position-left simptip-movable"
        data-tooltip={tab.name}
      >
        <Identicon seed={acc.address} className="dapp-tiny" />
      </span>
    ))
  }

  renderConnectButton = () => {
    return (
      <span>
        <span className="connect-button">
          {i18n.t('mist.browserBar.buttons.connect')}
        </span>
        <span
          className="simptip-position-left simptip-movable no-accounts"
          data-tooltip={i18n.t('mist.browserBar.buttons.noAccounts')}
        />
      </span>
    )
  }

  render() {
    const { selectedTab: tab, dappAccounts, url, onUrlChanged } = this.props

    const icon = tab && tab.icon
    const nameFull = 'fullName'
    const name = tab && tab.name

    return (
      <div className="browser-bar">
        <button
          title="go back"
          className="back icon icon-arrow-left"
          onClick={this.handleGoBackClick}
        />
        <button
          title="refresh page"
          className="reload icon icon-refresh"
          onClick={this.handleReloadClick}
        />
        <div className="app-bar">
          <label
            htmlFor="url-input"
            className={`dapp-info ${icon && 'has-icon'}`}
          >
            {icon && <img alt="app icon" src={icon} className="app-icon" />}
            <span title={nameFull}>{name}</span>
          </label>
          {false ? (
            <UrlInputBreadcrumb url={url} />
          ) : (
            <UrlInput url={url} onUrlChanged={onUrlChanged} />
          )}
          <button className="accounts" onClick={this.handleAccountClick}>
            {dappAccounts.length > 0
              ? this.renderAccounts()
              : this.renderConnectButton()}
          </button>
        </div>
      </div>
    )
  }
}
