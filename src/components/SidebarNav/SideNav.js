import React, { Component } from 'react'
import { NavLink } from "react-router-dom";
import ReactDOM from 'react-dom'

import './SideNav.css'

import NodeInfo from '../NodeInfo'

class NavItem extends Component {
  constructor(props){
    super(props)
    this.state = { 
      submenucontainer: {
        'visibility': 'hidden',
        'opacity': 0
      }
    }
  }
  handleMouseLeave = () => {
    this.setState({
      submenucontainer: {
        'visibility': 'hidden',
        'opacity': 0
      }
    })
  }
  handleMouseEnter = () => {
    let el = ReactDOM.findDOMNode(this)   
    this.setState({
      submenucontainer: {
        'visibility': 'visible',
        'opacity': 1,
        'top': (el.offsetTop) + 'px'
      }
    })
  }
  renderSubmenu() {
    let subMenu = []
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
  render(){
    let badge = ''
    let icon = this.props.item.icon || ''
    let name = this.props.item.name
    let nameFull = ''
    let link = this.props.item.route || (name === 'wallet' ? 'wallet' : 'browser')
    return (
      <li className={'browser'} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
      <header>
        <NavLink to={'/'+link}>
          <button className={"main " + (badge && 'has-badge')}>
            {icon
              ? <img src={icon} draggable="false" />
              : <i className="icon-globe"></i>
            }
          </button>
        </NavLink>
      </header>
      <section className="submenu-container" style={this.state.submenucontainer}>
        <section>
          <header>
            <span title={nameFull}>{name}</span>
            {this.renderSubmenu()}
          </header>
        </section>
      </section>
    </li>
    )
  }
}

class Sidebar extends Component {
  constructor(props){
    super(props)
  }
  render(){
    let tabs = [
      {id: 0, name: 'wallet', icon: 'https://cdn4.iconfinder.com/data/icons/money-13/24/Wallet-2-512.png'},
      {id: 1, name: 'dapps', icon: 'https://cdn4.iconfinder.com/data/icons/web-mobile-round1/210/Untitled-35-512.png', route: `dapps`},
      //{id: 2, name: 'contracts', icon: 'https://cdn2.iconfinder.com/data/icons/business-finance-line-1/24/Contract-512.png'},
      {id: 4, name: 'browser', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKnps1AIerbVNbkDAn77mxjUIDQPeWdlNDiFwJlOlVfMECvLEP_g'},
      {id: 3, name: 'remix', icon: 'https://raw.githubusercontent.com/horizon-games/remix-app/master/resources/icon.png', route: `browser/${encodeURIComponent('https://remix.ethereum.org/')}`},
      //{id: 4, name: 'swarm', icon: 'https://swarm-guide.readthedocs.io/en/latest/_images/swarm.png'},
      //{id: 5, name: 'tools', icon: 'https://d1nhio0ox7pgb.cloudfront.net/_img/i_collection_png/256x256/plain/tools.png'},
      //{id: 6, name: 'network', icon: 'http://downloadicons.net/sites/default/files/network-icon-76424.png'},
      //{id: 7, name: 'learn', icon: ''},
    ]
    return (
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-menu">
            {tabs.map(tab => {
              //return <SidebarTab key={tab.id || tab._id} tab={tab} tabChanged={this.handleTabChanged} selected={this.props.selectedTab.id === tab.id}/>
              return <NavItem item={tab}></NavItem>
            })}
          </ul>
        </nav>
        <div id="react__node-info">
          <NodeInfo/>
        </div>
      </aside>
    )
  }
}

export default Sidebar