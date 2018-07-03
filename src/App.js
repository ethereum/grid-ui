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
      {
        id: 'browser',
        name: 'browser',
        url: 'http://www.ethereum.org'
      },
      {
        id: 'wallet',
        name: 'wallet',
        url: `file://${__dirname}/wallet/index.html`,
        redirect: `file://${__dirname}/wallet/index.html`,
        position: 0,
        permissions: {
          admin: true
        }
      },
      {
        id:2, 
        name: 'tab 2',
        selected: true,
        url: 'http://www.google.com',
        subMenu: [
          {name: 'action 1', selected: true},
          {name: 'action 2'}
        ]
      },
      {id:3, name: 'tab 3', url: 'http://www.github.com/philipplgh'},
      {id:4, name: 'tab 4', url: 'http://www.example.com'},
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
        <Sidebar tabs={this.state.tabs} selectedTab={this.state.selectedTab} tabChanged={this.handleTabChanged} />
        <Browserbar url={this.state.selectedTab.url}/>
        <Webviews tabs={this.state.tabs} selectedTab={this.state.selectedTab}/>
      </Fragment>
    )
  }
}

export default App