import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css'
// fakeAPI needs to be initialized before any other component is loaded
import './fakeAPI.js'
import './App.css'
import { BrowserRouter, Link } from "react-router-dom";
import Routes from "./Routes"
import Sidebar from './components/Sidebar'
import Sidenav from './components/SideNav'

import Wallet from "./containers/Wallet"

import {Collections} from './API'

export default class App extends Component {
  constructor(props){
    super(props)

    /*only needed when dbSync.js is used to simulate meteor env
    const Tracker = {
      afterFlush(callback){callback()}
    } 
    window.Tracker = Tracker
    window._ = _
    */  

    let {Tabs, Accounts} = Collections
    let tabs = Tabs.array.sort(el => el.position)
    let selectedTab = tabs[0] || { url: 'https://www.github.com/ethereum/mist-ui-react' }

    this.state = {
      selectedTab,
      tabs: tabs,
      accounts: Accounts
    }
  }
  handleTabChanged = (tab) =>  {
    this.setState({
      selectedTab: tab
    })
  }
  render() {
    let mode = 2
    return (
      <Fragment>
        {/* layout/main.html */}
        {
          mode === 1 
          ? <Sidebar tabs={this.state.tabs} selectedTab={this.state.selectedTab} tabChanged={this.handleTabChanged} />
          : <Sidenav tabs={this.state.tabs} />
        }
        <Routes/>
      </Fragment>
    )
  }
}
