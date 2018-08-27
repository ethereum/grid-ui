import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css'
import './fakeAPI.js'
import Webviews from './components/Webviews'
import Sidebar from './components/Sidebar'
import Browserbar from './components/Browserbar'

import {Collections} from './API'

class App extends Component {
  constructor(props){
    super(props)
    this.handleTabChanged = this.handleTabChanged.bind(this)
    this.handleIconAvailable = this.handleIconAvailable.bind(this)
    this.handleTitleAvailable = this.handleTitleAvailable.bind(this)

    let dirname = 'D:/Projects/MistTau/mist-ui-react'

    /*only needed when dbSync.js is used to simulate meteor env
    const Tracker = {
      afterFlush(callback){callback()}
    } 
    window.Tracker = Tracker
    window._ = _
    */  

    let {Tabs} = Collections
    let tabs = Tabs.array.sort(el => el.position)

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
    if(tab.id === 'wallet') return
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

    let dappAccountsTest = [
      {
        address: '0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'
      },
      {
        address: '0x554f8e6938004575bd89cbef417aea5c18140d92'
      }
    ]

    return (
      <Fragment>
        {/* layout/main.html */}
        <Sidebar tabs={this.state.tabs} selectedTab={this.state.selectedTab} tabChanged={this.handleTabChanged} />
        <Browserbar 
          url={this.state.selectedTab.url}
          dappAccounts = {dappAccountsTest}
          selectedTab={this.state.selectedTab}/>
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