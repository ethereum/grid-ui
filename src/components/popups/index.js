import React from 'react'

import UpdateAvailable from './ClientUpdateAvailable'
import ConnectAccount from './ConnectAccount'
import Settings from './Settings'

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
