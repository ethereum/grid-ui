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
    this.handleIconAvailable = this.handleIconAvailable.bind(this)
    this.handleTitleAvailable = this.handleTitleAvailable.bind(this)

    let dirname = 'D:/Projects/MistTau/mist-ui-react'

    //let _tabs = window.Tabs.find({}, { sort: { position: 1 } }).fetch();
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
  handleIconAvailable(tab, icon) {
    this.setState(prevState => {
      let tabs = [...prevState.tabs] // copy tabs state
      let tabIdx = tabs.findIndex(t => (t.id === tab.id)) // find changed item
      let tabM = {
        ...tabs[tabIdx], // create copy of changed item
        icon: icon // & modify copy
      } 
      tabs[tabIdx] = tabM // write changes to new tabs state
      return {
        tabs: tabs 
      }
    })
  }  
  handleTitleAvailable(tab, title) {
    console.log('handle bar available:', tab, title)
    this.setState(prevState => {
      let tabs = [...prevState.tabs] // copy tabs state
      let tabIdx = tabs.findIndex(t => (t.id === tab.id)) // find changed item
      let tabM = {
        ...tabs[tabIdx], // create copy of changed item
        name: title // & modify copy
      } 
      tabs[tabIdx] = tabM // write changes to new tabs state
      return {
        tabs: tabs 
      }
    })
  }
  render() {
    return (
      <Fragment>
        {/* layout/main.html */}
        <Sidebar tabs={this.state.tabs} selectedTab={this.state.selectedTab} tabChanged={this.handleTabChanged} />
        <Browserbar url={this.state.selectedTab.url} selectedTab={this.state.selectedTab}/>
        <Webviews 
          tabs={this.state.tabs} 
          selectedTab={this.state.selectedTab}
          onIconAvailable={this.handleIconAvailable}
          onTitleAvailable={this.handleTitleAvailable}
        />
      </Fragment>
    )
  }
}

export default App