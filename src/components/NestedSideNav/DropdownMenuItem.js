import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import './NestedSideNav.css'

class DropdownMenuItem extends Component {
  static propTypes = {
    item: PropTypes.any
  }

  state = {
    open: false
  }

  handleMenuExpand = () => {
    const { open } = this.state

    this.setState({
      open: !open
    })
  }

  render() {
    const { open } = this.state
    const { item } = this.props

    const subitems = item.subitems || []

    return (
      <React.Fragment>
        <button
          className={`dropdown-btn ${open ? 'active' : ''}`}
          onClick={() => this.handleMenuExpand('dropdown')}
        >
          {item.name}
          <i className="fa fa-caret-down" />
        </button>
        <div
          className="dropdown-container"
          style={{ display: open ? 'block' : 'none' }}
        >
          {subitems.map(sub => (
            <NavLink key={sub.id} to={`/${sub.route}`}>
              {sub.name}
            </NavLink>
          ))}
        </div>
      </React.Fragment>
    )
  }
}

export default DropdownMenuItem
