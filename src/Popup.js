import React from 'react'
// import './App.css';
import './styles/styles.css';

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'
import SendTransactionConfirmation from './popups/SendTransactionConfirmation'

function PopupBase({ name }) {
  switch(name){
    case 'ConnectAccount':
      return <ConnectAccount />
    case 'SendTransactionConfirmation':
      return <SendTransactionConfirmation />
    default:
      return <UpdateAvailable />
  }     
}

export default PopupBase