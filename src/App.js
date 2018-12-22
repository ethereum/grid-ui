import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css'
// fakeAPI needs to be initialized before any other component is loaded
import './fakeAPI.js'
import './App.css'
import Routes from "./Routes"
import Sidebar from './components/Sidebar'
import Sidenav from './components/SidebarNav/SideNav'

import {Collections} from './API'
import NestedSideNav from './components/NestedSideNav';
// import Drawer from './components/Tau/Drawer';

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
  }
  render() {
    let mode = 2
    let isTau = true

    let items = [
      {id: 0, name: 'Wallet', route: 'wallet', subitems: [
        {id: '0a', name: 'Create Account', route: 'account/create'},
        {id: '0b', name: 'Import Account', route: 'account/import'},
      ]},
      {id: 1, name: 'Tx', route: 'tx', subitems: [
        {id: '1a', name: 'Send', route: 'tx/send'},
        {id: '1b', name: 'History',  route: 'tx/history'}
      ]},
      {id: 2, name: 'Tools', route: 'tools', subitems: [
        {id: '2a', name: 'Validation', route: 'tools/validation'},
        {id: '2b', name: 'Conversion',  route: 'tools/conversion'},
        {id: '2c', name: 'RPC',  route: 'tools/rpc'},
      ]},
      {id: 3, name: 'Network', route: 'network', subitems: [
        {id: '3a', name: 'Config', route: 'network/config'},
        {id: '3b', name: 'Geth Config', route: 'network/nodeconfig'},
      ]},
      {id: 4, name: 'Browser', route: 'browser', subitems: [
        {id: '4a', name: 'Browser', route: 'browser'},
      ]},

      // {id: 0, name: 'wallet', icon: 'https://cdn4.iconfinder.com/data/icons/money-13/24/Wallet-2-512.png'},
      // {id: 1, name: 'dapps', icon: 'https://cdn4.iconfinder.com/data/icons/web-mobile-round1/210/Untitled-35-512.png', route: `dapps`},
      // {id: 2, name: 'contracts', icon: 'https://cdn2.iconfinder.com/data/icons/business-finance-line-1/24/Contract-512.png'},
      // {id: 4, name: 'browser', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKnps1AIerbVNbkDAn77mxjUIDQPeWdlNDiFwJlOlVfMECvLEP_g'},
      // {id: 3, name: 'remix', icon: 'https://raw.githubusercontent.com/horizon-games/remix-app/master/resources/icon.png', route: `browser/${encodeURIComponent('https://remix.ethereum.org/')}`},
      // {id: 4, name: 'swarm', icon: 'https://swarm-guide.readthedocs.io/en/latest/_images/swarm.png'},
      // {id: 5, name: 'tools', icon: 'https://d1nhio0ox7pgb.cloudfront.net/_img/i_collection_png/256x256/plain/tools.png', route: `tools`},
      // {id: 6, name: 'network', icon: 'http://downloadicons.net/sites/default/files/network-icon-76424.png'},
      // {id: 7, name: 'learn', icon: ''},
    ]

    return (
      <Fragment>
        {/*
        <Drawer items={tabs}>
          <Sidenav tabs={tabs}/>
        </Drawer>
        <Sidenav tabs={tabs}/>
        */}
        <NestedSideNav items={items} />
        <Routes/>
      </Fragment>
    )
  }
}
