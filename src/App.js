import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css'
// fakeAPI needs to be initialized before any other component is loaded
// import './fakeAPI.js'
import './App.css'
import Routes from './Routes'
import NestedSideNav from './components/NestedSideNav'

export default class App extends Component {
  render() {
    const items = [
      {
        id: 0,
        name: 'Wallet',
        route: 'wallet',
        subitems: [
          { id: '0a', name: 'Create Account', route: 'account/create' },
          { id: '0b', name: 'Import Account', route: 'account/import' }
        ]
      },
      {
        id: 1,
        name: 'Tx',
        route: 'tx',
        subitems: [
          { id: '1a', name: 'Send', route: 'tx/send' },
          { id: '1b', name: 'History', route: 'tx/history' }
        ]
      },
      {
        id: 2,
        name: 'Tools',
        route: 'tools',
        subitems: [
          { id: '2a', name: 'Validation', route: 'tools/validation' },
          { id: '2b', name: 'Conversion', route: 'tools/conversion' },
          { id: '2c', name: 'RPC', route: 'tools/rpc' }
        ]
      },
      {
        id: 3,
        name: 'Network',
        route: 'network',
        subitems: [
          { id: '3a', name: 'Config', route: 'network/config' },
          { id: '3b', name: 'Geth Setup', route: 'network/nodesetup' },
          { id: '3c', name: 'Geth Config', route: 'network/nodeconfig' }
        ]
      },
      {
        id: 4,
        name: 'Browser',
        route: 'browser',
        subitems: [{ id: '4a', name: 'Browser', route: 'browser' }]
      }

      // {id: 5, name: 'dapps', icon: 'https://cdn4.iconfinder.com/data/icons/web-mobile-round1/210/Untitled-35-512.png', route: `dapps`},
      // {id: 6, name: 'contracts', icon: 'https://cdn2.iconfinder.com/data/icons/business-finance-line-1/24/Contract-512.png'},
      // {id: 7, name: 'remix', icon: 'https://raw.githubusercontent.com/horizon-games/remix-app/master/resources/icon.png', route: `browser/${encodeURIComponent('https://remix.ethereum.org/')}`},
      // {id: 8, name: 'swarm', icon: 'https://swarm-guide.readthedocs.io/en/latest/_images/swarm.png'},
    ]

    return (
      <Fragment>
        <NestedSideNav items={items} />
        <Routes />
      </Fragment>
    )
  }
}
