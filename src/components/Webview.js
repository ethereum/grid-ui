import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import {Helpers} from '../API'
let useIframe = !Helpers.isElectron()

class IframeWebview extends Component {
  render() {
    var iframeStyle = {
      width:"100%",
      height:"100%",
      marginTop: "70px"
    }
    return (
      <iframe src={this.props.src} style={iframeStyle}></iframe>
    )
  }
}

export default class Webview extends Component {
  constructor(props) {
    super()
  }
  render() {
    let checkedUrl = this.checkedUrl(this.props.url)
    return (
      <div className={"webview " + (this.props.visible ? "visible" : "hidden")}>
        {useIframe
        ?<IframeWebview src={checkedUrl}/>
        :<webview src={checkedUrl} autosize="true" webpreferences="contextIsolation=yes"></webview>
        }
      </div>
    )
  }
  checkedUrl(url) {
    return url
  }
  componentDidMount() {
    console.log('webview was mounted')
    let el = ReactDOM.findDOMNode(this)
    el.addEventListener('will-navigate', this.handleNavigate)
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this)
    el.removeEventListener('will-navigate', this.handleNavigate)
  }
  handleNavigate() {
    console.log('navigate navigate')
  }
}