import React from 'react'
// import './App.css';
import './styles/styles.css';

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'

function PopupBase({ name }) {
  switch(name){
    case 'ConnectAccount':
      return <ConnectAccount />
    default:
      return <UpdateAvailable />
  }     
}

export default PopupBase