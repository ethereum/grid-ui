import React from 'react'

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'
import Settings from './popups/Settings'

function PopupBase({ name, popup }) {
  console.log('load content for popup: ', name)
  switch (name) {
    case 'ConnectAccount':
      return <ConnectAccount popup={popup} />
    case 'SendTransactionConfirmation':
      return <span>TODO send tx confirmation</span>
    case 'Settings':
      return <Settings />
    default:
      return <UpdateAvailable />
  }
}

export default PopupBase
