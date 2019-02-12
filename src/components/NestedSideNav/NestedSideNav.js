import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DropdownMenuItem from './DropdownMenuItem'
import './NestedSideNav.css'

class NestedSideNav extends Component {
  static propTypes = {
    items: PropTypes.array
  }

  render() {
    const { items } = this.props

    return (
      <div className="sidenav">
        {items.map(item => (
          <DropdownMenuItem key={item.id} item={item} />
        ))}
      </div>
    )
  }
}

export default NestedSideNav
