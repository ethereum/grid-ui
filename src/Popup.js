import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css';

import UpdateAvailable from './popups/ClientUpdateAvailable'

class PopupBase extends Component {
  render() {
    return (     
      <UpdateAvailable />
    )
  }
}

export default PopupBase