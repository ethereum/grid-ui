import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import './SideNav.css'

class NavItem extends Component {
  static propTypes = {
    item: PropTypes.any,
    selected: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = {
      submenucontainer: {
        visibility: 'hidden',
        opacity: 0
      }
    }
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
    const el = ReactDOM.findDOMNode(this) // eslint-disable-line
    this.setState({
      submenucontainer: {
        visibility: 'visible',
        opacity: 1,
        top: `${el.offsetTop} px`
      }
    })
  }

  renderSubmenu = () => {
    const { selected } = this.props

    const subMenu = []
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
    const { item } = this.props
    const { submenucontainer } = this.state

    const badge = ''
    const { /* icon = '', */ name } = item
    const nameFull = ''
    const link = item.route || (name === 'wallet' ? 'wallet' : 'browser')

    return (
      <li
        className="browser"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <header>
          <NavLink to={`/${link}`}>
            <button className={`main ${badge && 'has-badge'}`}>
              {name}
              {/* icon
              ? <img src={icon} draggable="false" />
              : <i className="icon-globe"></i>
            */}
            </button>
          </NavLink>
        </header>
        <section className="submenu-container" style={submenucontainer}>
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

export default NavItem
