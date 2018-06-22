import React, { Component } from 'react'

import SidebarTab from './SidebarTab'
import NodeInfo from './NodeInfo'
import Provider from './GenericProvider'

class Sidebar extends Component {
  constructor(){
    super()
  }
  render(){
    return (
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-menu">
            {[1,2,3].map(element => {
              return <SidebarTab key={element.toString()} />
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
