import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NodeInfo from 'ethereum-react-components'
import SidebarTab from './SidebarTab'

class Sidebar extends Component {
  static propTypes = {
    selectedTab: PropTypes.any,
    tabChanged: PropTypes.func,
    tabs: PropTypes.any
  }

  handleTabChanged = tab => {
    const { tabChanged } = this.props

    tabChanged(tab)
  }

  render() {
    const { tabs, selectedTab } = this.props

    return (
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-menu">
            {tabs.map(tab => {
              return (
                <SidebarTab
                  key={tab.id || tab._id}
                  tab={tab}
                  tabChanged={this.handleTabChanged}
                  selected={selectedTab.id === tab.id}
                />
              )
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
