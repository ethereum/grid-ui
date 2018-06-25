import React, { Component, Fragment } from 'react'
// import './App.css';
import './styles/styles.css'
import './fakeAPI.js'
import Webviews from './components/Webviews'
import Sidebar from './components/Sidebar'
import Browserbar from './components/Browserbar'

class App extends Component {
  render() {
    return (
      <Fragment>
        {/* layout/main.html */}
        <Sidebar />
        <Browserbar />
        <Webviews />
      </Fragment>
    )
  }
}

export default App