import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Identicon } from 'ethereum-react-components'
import iconPath from '../icons/browse-icon@2x.png'
import { i18n } from '../API'

class SidebarTab extends Component {
  static propTypes = {
    tab: PropTypes.any,
    tabChanged: PropTypes.any,
    selected: PropTypes.any
  }

  constructor(props) {
    super(props)

    // query connected accounts for this dapp
    const dappAccounts = []
    /*
    if (this.permissions) {
      if (limit) {
        return EthAccounts.find(
          { address: { $in: this.permissions.accounts || [] } },
          { limit: limit }
        );
      }
      return EthAccounts.find({
        address: { $in: this.permissions.accounts || [] }
      });
    }
    */
    this.state = {
      submenucontainer: {
        visibility: 'hidden',
        opacity: 0,
        top: '300px'
      },
      dappAccounts
    }
    this.badge = ''
  }

  handleMouseLeave = () => {
    this.setState({
      submenucontainer: {
        visibility: 'hidden',
        opacity: 0
      }
    })
  }

  handleMouseEnter = () => {
    // const el = ReactDOM.findDOMNode(this)
    console.log('handle mouse enter')
    this.setState({
      submenucontainer: {
        visibility: 'visible',
        opacity: 1,
        top: '400px' // (el.offsetTop - 200)+ 'px'
      }
    })
    /*
    TODO
    $submenu.css(
      'max-height',
      windowHeight - tabTopOffset - submenuHeaderHeight - 30 + 'px'
    );
    */
  }

  handleConnectBtnClick = () => {}

  handleTabClick = () => {
    const { tabChanged, tab } = this.props

    tabChanged(tab)
  }

  renderIdenticons = () => {
    const { dappAccounts } = this.state

    return (
      <button className="display">
        <span>
          {dappAccounts.length} {i18n.t('mist.sidebar.submenu.account')}
        </span>
        <span className="dapp-identicon-container">
          {dappAccounts.map(acc => {
            return (
              <Identicon
                key={acc.address}
                seed={acc.address}
                className="dapp-tiny"
              />
            )
          })}
        </span>
      </button>
    )
  }

  renderAccounts = () => {
    const { dappAccounts } = this.state

    return (
      <div className="accounts">
        {dappAccounts.length > 0 ? (
          this.renderIdenticons()
        ) : (
          <button className="connect" onClick={this.handleConnectBtnClick}>
            {i18n.t('mist.sidebar.submenu.connectAccounts')}
          </button>
        )}
      </div>
    )
  }

  renderSubmenu = () => {
    const { tab, selected } = this.props

    const { subMenu } = tab
    const badge = ''

    if (!subMenu) {
      return ''
    }

    return (
      <ul className="sub-menu">
        {subMenu.map(menu => {
          return (
            <li key={menu.name}>
              <button className={selected ? 'selected' : ''}>
                {menu.name}
              </button>
              {badge && <span className="badge">{badge}</span>}
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const { tab, selected } = this.props
    const { submenucontainer } = this.state

    const icon = tab.id === 'browser' ? iconPath : tab.icon

    const isWallet = tab.id === 'wallet'
    const isBrowser = tab.id === 'browser'

    const name = isBrowser ? i18n.t('mist.sidebar.buttons.browser') : tab.name
    const nameFull = 'foo'

    const tabShouldBeRemovable = true

    return (
      <li // eslint-disable-line
        className={
          isWallet
            ? 'wallet'
            : `${isBrowser ? 'browser' : ''} ${selected && 'selected'}`
        }
        data-tab-id={tab.id}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleTabClick}
      >
        <header>
          <button className={`main ${this.badge && 'has-badge'}`}>
            {icon ? (
              <img src={icon} draggable="false" alt="icon-img" />
            ) : (
              <i className="icon-globe" />
            )}
          </button>
        </header>
        <section className="submenu-container" style={submenucontainer}>
          <section>
            <header>
              <span title={nameFull}>{name}</span>
              {this.badge && <div className="badge">{this.badge}</div>}
              {tabShouldBeRemovable && (
                <button className="remove-tab"> &times; </button>
              )}
              {!isWallet && this.renderAccounts()}
              {this.renderSubmenu()}
            </header>
          </section>
        </section>
      </li>
    )
  }
}

export default SidebarTab
