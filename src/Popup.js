import React from 'react'
import Provider from './components/GenericProvider'
// import './App.css';
import './styles/styles.css';

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'
import SendTransactionConfirmation from './popups/SendTransactionConfirmation'
import SendTx from './components/SendTx'
import TxHistory from './components/TxHistory'
import RequestAccount from './components/RequestAccount'

function PopupBase({ name, popup }) {
  console.log('load content for popup: ', name)
  switch(name){
    case 'ConnectAccount':
    case 'connectAccount':
      return <ConnectAccount popup={popup}/>
    case 'RequestAccount':
    case 'CreateAccount':
      return <RequestAccount />
    case 'SendTransactionConfirmation':
      return <SendTransactionConfirmation />
    case 'SendTx':
      return <SendTx />
    case 'TxHistory':
      return <TxHistory />
    default:
      return <UpdateAvailable />
  }     
}

export default PopupBase