import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css'
// fakeAPI needs to be initialized before any other component is loaded
import './fakeAPI.js'
import './App.css'
import { BrowserRouter, Link } from "react-router-dom";
import Routes from "./Routes"
import Sidebar from './components/Sidebar'
import Sidenav from './components/SideNav'

import {Collections} from './API'

export default class App extends Component {
  constructor(props){
    super(props)

    /*only needed when dbSync.js is used to simulate meteor env
    const Tracker = {
      afterFlush(callback){callback()}
    } 
    window.Tracker = Tracker
    window._ = _
    */  
  }
  render() {
    let mode = 2
    return (
      <Fragment>
        <Sidenav/>
        <Routes/>
      </Fragment>
    )
  }
}
