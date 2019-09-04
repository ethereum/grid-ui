import React, { Component } from 'react'
import { Window, TitleBar } from 'react-desktop/windows'
import { Grid } from '../API'

class ConditionalWindow extends Component {
  state = {
    isMaximized: false
  }

  renderWithWindow = children => {
    const { isMaximized } = this.state
    return (
      <Window theme="dark" chrome={false} background>
        <TitleBar
          title="Ethereum Grid"
          controls
          background="rgba(88, 88, 88, 0.33)"
          isMaximized={isMaximized}
          onCloseClick={() => {
            Grid.window.close()
          }}
          onMaximizeClick={() => {
            Grid.window.maximize()
            this.setState({ isMaximized: true })
          }}
          onMinimizeClick={() => {
            Grid.window.minimize()
          }}
          onRestoreDownClick={() => {
            Grid.window.unmaximize()
            this.setState({ isMaximized: false })
          }}
        />
        <div
          style={{
            display: 'flex',
            height: '100vh',
            width: '100vw'
          }}
        >
          {children}
        </div>
      </Window>
    )
  }

  render() {
    const platform = Grid.platform.name
    // eslint-disable-next-line react/prop-types
    const { children } = this.props
    const isWindows = platform === 'win32'
    return isWindows && !Grid.window.hasFrame() ? (
      this.renderWithWindow(children)
    ) : (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%'
        }}
      >
        {children}
      </div>
    )
  }
}

export default ConditionalWindow
