import React, { Component } from 'react'
import { NavLink } from "react-router-dom";
import ReactDOM from 'react-dom'

import './SideNav.css'

import NodeInfo from 'ethereum-react-components'

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
    const { item } = this.props
    let badge = ''
    let icon = item.icon || ''
    let name = item.name
    let nameFull = ''
    let link = item.route || (name === 'wallet' ? 'wallet' : 'browser')
    return (
      <li className={'browser'} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
      <header>
        <NavLink to={'/'+link}>
          <button className={"main " + (badge && 'has-badge')}>
            {name}
            {/*icon
              ? <img src={icon} draggable="false" />
              : <i className="icon-globe"></i>
            */}
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
    let tabs = this.props.tabs
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