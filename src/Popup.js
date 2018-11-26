import React from 'react'
// import './App.css';
import './styles/styles.css';

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'
import SendTransactionConfirmation from './popups/SendTransactionConfirmation'
import SendTx from './components/SendTx'
import { TxHistory } from 'ethereum-react-components'
import CreateAccount from './popups/CreateAccount/RequestAccount'
import Settings from './popups/Settings'

function PopupBase({ name, popup }) {
  console.log('load content for popup: ', name)
  switch(name){
    case 'ConnectAccount':
      return <ConnectAccount popup={popup}/>
    case 'RequestAccount':
    case 'CreateAccount':
      return <CreateAccount />
    case 'SendTransactionConfirmation':
      return <SendTransactionConfirmation />
    case 'Settings':
      return <Settings />    
    case 'SendTx':
      return <SendTx />
    case 'TxHistory':
      return <TxHistory />
    default:
      return <UpdateAvailable />
  }     
}

export default PopupBase