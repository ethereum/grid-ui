import React, { Component } from 'react'

import SidebarTab from './SidebarTab'
import NodeInfo from './NodeInfo'
import Provider from './GenericProvider'

class Sidebar extends Component {
  constructor(){
    super()
  }
  render(){

    let tabs = [
      {id:1},
      {id:2},
    ]

    return (
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-menu">
            {tabs.map(element => {
              return <SidebarTab key={element.id} />
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
