import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import whitelist from './Whitelist.json'

import {Helpers} from '../../API'
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

let __dirname = window.__dirname

export default class Webview extends Component {
  constructor(props) {
    super(props)
    this.handleIpcMessage = this.handleIpcMessage.bind(this)
    this.handleDomReady = this.handleDomReady.bind(this)
  }
  render() {
    let checkedUrl = this.checkedUrl(this.props.url)
    //let preloadScriptPath = Helpers.isMist() ? '/modules/preloader/browser.js' : './preload.js' //'/preload-webview.js'
    let preloadScriptPath = 'src/components/Browser/preload.js'
    let preloadFile = `file://${__dirname}/${preloadScriptPath}` 
    //console.log('preload file:', preloadFile)
    return (
      <div className={"webview " + (this.props.visible ? "visible" : "hidden")}>
        {useIframe
        ?<IframeWebview src={checkedUrl}/>
        :<webview src={checkedUrl} autosize="true" webpreferences="contextIsolation=yes" preload={preloadFile}></webview>
        }
      </div>
    )
  }
  checkedUrl(url) {
    let userSettings = this.props.userSettings

    if(url.startsWith('examples:')){
      if(url === 'examples:') return `file://${__dirname}/public/examples/index.html`      
      if(url === 'examples:request.access') return `file://${__dirname}/public/examples/request-access.html`
    }
    if(!url.startsWith('http')){
      url = 'http://'+url
    }
    if(userSettings.useWhitelist && !whitelist.includes(url)){
      return `file://${__dirname}/public/errors/400.html`
    }
    return url
  }
  componentDidMount() {
    let webview = ReactDOM.findDOMNode(this).childNodes[0]
    webview.addEventListener('will-navigate', this.handleNavigate)
    webview.addEventListener('ipc-message', this.handleIpcMessage)
    webview.addEventListener('dom-ready', this.handleDomReady)
  }
  componentWillUnmount() {
    let webview = ReactDOM.findDOMNode(this).childNodes[0]
    webview.removeEventListener('will-navigate', this.handleNavigate)
    webview.removeEventListener('ipc-message', this.handleIpcMessage)
    webview.removeEventListener('dom-ready', this.handleDomReady)
  }
  handleNavigate = (args) => {
    this.props.onNavigate(args.url)
  }
  // MIST API for installed tabs/dapps
  // see mistAPIBackend.js
  handleIpcMessage(event) {
    var arg = event.args[0]
    // SET FAVICON
    if (event.channel === 'favicon') { this.props.onIconAvailable(arg) }
    // if (event.channel === 'appBar') { this.props.onAppBarAvailable(arg) }
    console.log('received webview ipc', event.channel)
  }
  handleDomReady(event) {
    let webview = ReactDOM.findDOMNode(this).childNodes[0]
    let titleFull = webview.getTitle()
    let title = titleFull

    if (titleFull && titleFull.length > 40) {
      title = titleFull.substr(0, 40)
      title += '…'
    }
    this.props.onTitleAvailable(title)

    webview.openDevTools()
  }
}