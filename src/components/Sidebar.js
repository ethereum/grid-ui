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
      {id:1, name: 'tab 1'},
      {id:2, name: 'tab 2'},
      {id:3, name: 'tab 3'},
    ]

    return (
      <aside className="sidebar">
        <nav>
          <ul className="sidebar-menu">
            {tabs.map(tab => {
              return <SidebarTab key={tab.id} tab={tab}/>
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
