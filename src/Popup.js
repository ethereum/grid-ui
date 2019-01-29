import React from 'react'
// import './App.css';
import {
  FormSendTx,
  FormCreateAccount,
  TxHistory
} from 'ethereum-react-components'
import './styles/styles.css'

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'
// import SendTransactionConfirmation from './popups/SendTransactionConfirmation'
import Settings from './popups/Settings'

function PopupBase({ name, popup }) {
  console.log('load content for popup: ', name)
  switch (name) {
    case 'ConnectAccount':
      return <ConnectAccount popup={popup} />
    case 'RequestAccount':
    case 'CreateAccount':
      return <FormCreateAccount />
    case 'SendTransactionConfirmation':
      return <span>TODO send tx confirmation</span>
    case 'Settings':
      return <Settings />
    case 'SendTx':
      return <FormSendTx />
    case 'TxHistory':
      return <TxHistory />
    default:
      return <UpdateAvailable />
  }
}

export default PopupBase
