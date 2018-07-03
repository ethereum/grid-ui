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

    let dirname = 'D:/Projects/MistTau/mist-ui-react'

    // let tabs = Tabs.find({}, { sort: { position: 1 } }).fetch();
    let tabs = [
      {
        id: 'wallet',
        name: 'Wallet',
        url: `file:///${dirname}/wallet.asar/index.html`,
        redirect: `file://${dirname}/wallet/index.html`,
        position: 0,
        permissions: {
          admin: true
        }
      },
      {
        id: 'browser',
        name: 'browser',
        url: 'http://www.ethereum.org'
      },
      {
        id:2, 
        name: 'tab 2',
        selected: true,
        url: 'https://www.stateofthedapps.com',
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