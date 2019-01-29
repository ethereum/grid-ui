import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import whitelist from './Whitelist.json'
import { Helpers } from '../../API'

const useIframe = !Helpers.isElectron()

class IframeWebview extends Component {
  static propTypes = {
    src: PropTypes.any
  }

  render() {
    const { src } = this.props

    const iframeStyle = {
      width: '100%',
      height: '100%',
      marginTop: '70px'
    }

    return <iframe src={src} style={iframeStyle} title="webview" />
  }
}

const { __basedir } = window

console.log('dirname: ', __basedir)

export default class Webview extends Component {
  static propTypes = {
    onIconAvailable: PropTypes.any,
    onNavigate: PropTypes.any,
    onTitleAvailable: PropTypes.any,
    url: PropTypes.any,
    userSettings: PropTypes.any,
    visible: PropTypes.any
  }

  componentDidMount() {
    const webview = ReactDOM.findDOMNode(this).childNodes[0]
    webview.addEventListener('will-navigate', this.handleNavigate)
    webview.addEventListener('ipc-message', this.handleIpcMessage)
    webview.addEventListener('dom-ready', this.handleDomReady)
  }

  componentWillUnmount() {
    const webview = ReactDOM.findDOMNode(this).childNodes[0]
    webview.removeEventListener('will-navigate', this.handleNavigate)
    webview.removeEventListener('ipc-message', this.handleIpcMessage)
    webview.removeEventListener('dom-ready', this.handleDomReady)
  }

  checkedUrl = url => {
    const { userSettings } = this.props

    if (url.startsWith('examples:')) {
      if (url === 'examples:') {
        return `file://${__basedir}/public/examples/index.html`
      }

      if (url === 'examples:request.access') {
        return `file://${__basedir}/public/examples/request-access.html`
      }
    }

    if (!url.startsWith('http')) {
      return `http://${url}`
    }

    if (userSettings.useWhitelist && !whitelist.includes(url)) {
      return `file://${__basedir}/public/errors/400.html`
    }

    return url
  }

  handleNavigate = args => {
    const { onNavigate } = this.props

    onNavigate(args.url)
  }

  // MIST API for installed tabs/dapps
  // see mistAPIBackend.js
  handleIpcMessage = event => {
    const { onIconAvailable } = this.props

    const arg = event.args[0]
    // SET FAVICON
    if (event.channel === 'favicon') {
      onIconAvailable(arg)
    }
    // if (event.channel === 'appBar') { this.props.onAppBarAvailable(arg) }
    console.log('received webview ipc', event.channel)
  }

  handleDomReady = event => {
    const { onTitleAvailable } = this.props

    const webview = ReactDOM.findDOMNode(this).childNodes[0]
    const titleFull = webview.getTitle()
    let title = titleFull

    if (titleFull && titleFull.length > 40) {
      title = titleFull.substr(0, 40)
      title += '…'
    }

    onTitleAvailable(title)

    webview.openDevTools()
  }

  render() {
    const { url, visible } = this.props

    const checkedUrl = this.checkedUrl(url)
    // const preloadScriptPath = Helpers.isMist() ? '/modules/preloader/browser.js' : './preload.js' //'/preload-webview.js'
    const preloadScriptPath = 'preload/preload-webview.js'
    const preloadFile = `file://${__basedir}/${preloadScriptPath}`
    // console.log('preload file:', preloadFile)
    return (
      <div className={`webview${visible ? 'visible' : 'hidden'}`}>
        {useIframe ? (
          <IframeWebview src={checkedUrl} />
        ) : (
          <webview
            src={checkedUrl}
            autosize="true"
            webpreferences="contextIsolation=yes"
            preload={preloadFile}
          />
        )}
      </div>
    )
  }
}
