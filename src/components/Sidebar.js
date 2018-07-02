import React, { Component } from 'react'

import SidebarTab from './SidebarTab'
import NodeInfo from './NodeInfo'
import Provider from './GenericProvider'

class Sidebar extends Component {
  constructor(props){
    super(props)
    this.handleTabChanged = this.handleTabChanged.bind(this)
  }
  handleTabChanged(tab) {
    this.props.tabChanged(tab)
  }
  render(){
    let tabs = this.props.tabs
    return (
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-menu">
            {tabs.map(tab => {
              return <SidebarTab key={tab.id} tab={tab} tabChanged={this.handleTabChanged}/>
            })}
          </ul>
        </nav>
        <div id="react__node-info">
          <Provider>
            <NodeInfo/>
          </Provider>
        </div>
      </aside>
    )
  }
}

export default Sidebar
