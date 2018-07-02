import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import iconPath from '../icons/icon2x.png'

import DappIdenticon from './DappIdenticon'

import {i18n} from '../API'

class SidebarTab extends Component {
  constructor(props) {
    super(props)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleClick = this.handleClick.bind(this)

    this.state = { 
      submenucontainer: {
        'visibility': 'hidden',
        'opacity': 0
      }
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
  handleClick() {
    this.props.tabChanged(this.props.tab)
  }
  renderSubmenu() {

    let subMenu = this.props.tab.subMenu
    // will only be rendered when truthy value
    let badge = ''

    if(!subMenu){
      return ''
    }

    return (
      <ul className="sub-menu">
        {subMenu.map(menu => {
          return <li key={menu.name}><button className={menu.selected && 'selected'}>{menu.name}</button>{badge && <span className="badge">{badge}</span>}</li>
        })}
      </ul>
    )
  }
  render() {
    let tab = this.props.tab
    let icon = tab.id === 'browser' ? iconPath : tab.icon

    let name = tab.id === 'browser' ? i18n.t('mist.sidebar.buttons.browser') : tab.name
    let nameFull = "foo"

    let tabShouldBeRemovable = true

    return (
    <li data-tab-id={tab.id} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} onClick={this.handleClick}>
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
            <div className="accounts">
              <button className="display">
                <span className="dapp-identicon-container">
                  <DappIdenticon /> 
                </span>
              </button>
            </div>
            {this.renderSubmenu()}
          </header>
        </section>
      </section>
    </li>
    );
  }
}

export default SidebarTab;