import React from 'react'
import UrlBar from './UrlBar'

class Webview extends React.Component {
  state = {
    currentUrl: 'http://localhost:3000'
  }

  componentDidMount() {
    const { webview } = this
    webview.addEventListener('will-navigate', this.handleWillNavigate)
    webview.addEventListener('ipc-message', this.handleIpcMessage)
    webview.addEventListener('dom-ready', this.handleDomReady)
  }

  componentWillUnmount() {
    const { webview } = this
    webview.removeEventListener('will-navigate', this.handleNavigate)
    webview.removeEventListener('ipc-message', this.handleIpcMessage)
    webview.removeEventListener('dom-ready', this.handleDomReady)
  }

  handleDomReady = () => {
    console.log('dom ready')
  }

  handleWillNavigate = () => {
    console.log('will navigate')
  }

  handleIpcMessage = () => {
    console.log('handle ipc')
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
    const { currentUrl } = this.state
    return (
      <div style={{ width: '100%' }}>
        <UrlBar
          onOpenDevTools={this.openDevTools}
          onNavigate={this.handleNavigate}
        />
        <div style={{ width: '100%', marginTop: 10 }}>
          <webview
            ref={ref => {
              this.webview = ref
            }}
            src={currentUrl}
            style={{
              display: 'inline-flex',
              width: '100%',
              height: '800px'
            }}
          />
        </div>
      </div>
    )
  }
}

export default Webview
