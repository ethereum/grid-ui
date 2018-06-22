import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css';

import UpdateAvailable from './popups/ClientUpdateAvailable'
import ConnectAccount from './popups/ConnectAccount'

function PopupBase({ name }) {
  console.log('popup base', arguments)
  switch(name){
    case 'ConnectAccount':
      return <ConnectAccount />
    default:
      return <UpdateAvailable />
  }     
}

export default PopupBase