import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iconPath from '../icons/browse-icon@2x.png'

import DappIdenticon from './DappIdenticon'

import {i18n} from '../API'

class SidebarTab extends Component {
  constructor(props) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleTabClick = this.handleTabClick.bind(this)
    this.handleConnectBtnClick = this.handleConnectBtnClick.bind(this)

    // query connected accounts for this dapp
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
    let dappAccounts = [
      { address: '0123' },
      { address: '2345' }
    ]

    this.state = { 
      submenucontainer: {
        'visibility': 'hidden',
        'opacity': 0
      },
      dappAccounts: dappAccounts
    }
    this.badge = 'http://via.placeholder.com/15x15'
  }
  handleMouseLeave() {
    this.setState({
      submenucontainer: {
        'visibility': 'hidden',
        'opacity': 0
      }
    })
  }
  handleMouseEnter() {
    console.log('mouse enter on sidebar tab')
    let el = ReactDOM.findDOMNode(this)   
    this.setState({
      submenucontainer: {
        'visibility': 'visible',
        'opacity': 1,
        'top': (el.offsetTop + 30) + 'px'
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
  handleConnectBtnClick() {

  }
  handleTabClick() {
    this.props.tabChanged(this.props.tab)
  }
  renderIdenticons() {
    return (
      <button className="display">
        <span>{this.state.dappAccounts.length} {i18n.t('mist.sidebar.submenu.account')}</span>
        <span className="dapp-identicon-container">
          {this.state.dappAccounts.map(acc => {
            return(
              <DappIdenticon key={acc.address} identity={acc.address} className="dapp-tiny"/> 
            )
          })}
        </span>
      </button>
    )
  }
  renderAccounts(){
    return (
      <div className="accounts">
        {this.state.dappAccounts.length > 0
          ? this.renderIdenticons()
          : <button className="connect" onClick={this.handleConnectBtnClick}>{i18n.t('mist.sidebar.submenu.connectAccounts')}</button>
        }
      </div>
    )
  }
  renderSubmenu() {

    let subMenu = this.props.tab.subMenu
    let badge = ''

    if(!subMenu){
      return ''
    }

    return (
      <ul className="sub-menu">
        {subMenu.map(menu => {
          return <li key={menu.name}><button className={this.props.selected ? 'selected' : ''}>{menu.name}</button>{badge && <span className="badge">{badge}</span>}</li>
        })}
      </ul>
    )
  }
  render() {
    let tab = this.props.tab
    let icon = tab.id === 'browser' ? iconPath : tab.icon

    let isWallet = tab.id === 'wallet'
    let isBrowser = tab.id === 'browser'

    let name = isBrowser ? i18n.t('mist.sidebar.buttons.browser') : tab.name
    let nameFull = "foo"

    let tabShouldBeRemovable = true

    return (
    <li className={isWallet ? 'wallet' : (isBrowser ? 'browser' : '') + ' ' + (this.props.selected && 'selected') } data-tab-id={tab.id} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleTabClick}>
      <header>
        <button className={"main " + (this.badge && 'has-badge')}>
          {icon
            ? <img src={icon} draggable="false" />
            : <i className="icon-globe"></i>
          }
        </button>
      </header>
      <section className="submenu-container" style={this.state.submenucontainer}>
        <section>
          <header>
            <span title={nameFull}>{name}</span>
            {this.badge && <div className="badge">{this.badge}</div>}
            {tabShouldBeRemovable && <button className="remove-tab"> &times; </button>}
            {!isWallet && this.renderAccounts()}
            {this.renderSubmenu()}
          </header>
        </section>
      </section>
    </li>
    );
  }
}

export default SidebarTab;