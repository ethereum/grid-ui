import React, { Component } from 'react'
import { withRouter } from "react-router"
import Browser from '../../components/Browser'

class BrowserView extends Component {
  render(){
    return (
    <main>
      <h1>Browser</h1>    
      <Browser match={this.props.match}/>
    </main>
    )
  }
}

export default withRouter(BrowserView)
