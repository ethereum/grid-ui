import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css'
import './fakeAPI.js'
import Webviews from './components/Webviews'
import Sidebar from './components/Sidebar'
import Browserbar from './components/Browserbar'

class App extends Component {
  constructor(props){
    super(props)
    this.handleTabChanged = this.handleTabChanged.bind(this)

    // let tabs = Tabs.find({}, { sort: { position: 1 } }).fetch();
    let tabs = [
      {id: 'browser', name: 'tab 1', url: 'http://www.ethereum.org'},
      {
        id:2, 
        name: 'tab 2',
        url: 'http://www.google.com',
        subMenu: [
          {name: 'action 1', selected: true},
          {name: 'action 2'}
        ]
      },
      {id:3, name: 'tab 3', url: 'http://www.github.com/philipplgh'},
    ]

    this.state = {
      selectedTab: {
        url: 'http://www.ethereum.org'
      },
      tabs: tabs
    }
  }
  handleTabChanged(tab) {
    this.setState({
      selectedTab: tab
    })
  }
  render() {
    return (
      <Fragment>
        {/* layout/main.html */}
        <Sidebar tabs={this.state.tabs} tabChanged={this.handleTabChanged} />
        <Browserbar url={this.state.selectedTab.url}/>
        <Webviews />
      </Fragment>
    )
  }
}

export default App