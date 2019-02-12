import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NodeInfo from 'ethereum-react-components'
import NavItem from './NavItem'
import './SideNav.css'

class Sidebar extends Component {
  static propTypes = {
    tabs: PropTypes.any
  }

  render() {
    const { tabs } = this.props
    return (
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-menu">
            {tabs.map(tab => {
              // return (
              // <SidebarTab
              // key={tab.id || tab._id}
              // tab={tab}
              // tabChanged={this.handleTabChanged}
              // selected={this.props.selectedTab.id === tab.id}
              // />
              // )
              return <NavItem key={tab.id} item={tab} />
            })}
          </ul>
        </nav>
        <div id="react__node-info">
          <NodeInfo />
        </div>
      </aside>
    )
  }
}

export default Sidebar
