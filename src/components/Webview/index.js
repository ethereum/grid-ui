import React from 'react'
import PropTypes from 'prop-types'
import UrlBar from './UrlBar'

class Webview extends React.Component {
  static propTypes = {
    url: PropTypes.string
  }

  state = {
    currentUrl: 'http://localhost:3000',
    showUrlBar: true
  }

  componentDidMount() {
    const { url } = this.props
    const { currentUrl } = this.state
    const { webview } = this
    webview.addEventListener('will-navigate', this.handleWillNavigate)
    webview.addEventListener('ipc-message', this.handleIpcMessage)
    webview.addEventListener('dom-ready', this.handleDomReady)
    if (url) {
      this.setState({
        currentUrl: url,
        // if url is localhost:3000 -> "dev app" -> show url bar
        showUrlBar: url === currentUrl
      })
    }
  }

  componentWillUnmount() {
    const { webview } = this
    webview.removeEventListener('will-navigate', this.handleNavigate)
    webview.removeEventListener('ipc-message', this.handleIpcMessage)
    webview.removeEventListener('dom-ready', this.handleDomReady)
  }

  handleDomReady = () => {
    console.log('Webview: DOM ready')
  }

  handleWillNavigate = () => {
    console.log('Webview: will navigate')
  }

  handleIpcMessage = () => {
    console.log('Webview: handle ipc')
  }

  handleNavigate = newUrl => {
    const { currentUrl } = this.state
    if (currentUrl === newUrl) {
      const { webview } = this
      webview.reload()
    }
    // TODO prevent non-localhost http navigation
    this.setState({
      currentUrl: newUrl
    })
  }

  openDevTools = () => {
    const { webview } = this
    webview.openDevTools()
  }

  render() {
    const { currentUrl, showUrlBar } = this.state
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {showUrlBar && (
          <UrlBar
            onOpenDevTools={this.openDevTools}
            onNavigate={this.handleNavigate}
          />
        )}
        <div
          style={{
            width: '100%',
            height: showUrlBar ? 'calc(100% - 52px)' : '100%'
          }}
        >
          <webview
            ref={ref => {
              this.webview = ref
            }}
            src={currentUrl}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>
    )
  }
}

export default Webview
