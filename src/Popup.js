import React from 'react'
import Provider from './components/GenericProvider'
// import './App.css';
import './styles/styles.css';

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'
import SendTransactionConfirmation from './popups/SendTransactionConfirmation'
import SendTx from './components/SendTx'
import TxHistory from './components/TxHistory'

function PopupBase({ name }) {
  console.log('load content for popup: ', name)
  switch(name){
    case 'ConnectAccount':
    case 'connectAccount':
    case 'requestAccount':
    case 'createAccount':
      return <ConnectAccount />
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