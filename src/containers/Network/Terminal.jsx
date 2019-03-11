import React, { Component } from 'react'
import { Mist } from '../../API'

const { geth } = Mist

export default class Terminal extends Component {
  state = {
    logs: []
  }

  componentDidMount = async () => {
    await this.startPolling()
  }

  componentDidUpdate = () => {
    const scrollHeight = this.terminalScrollView.scrollHeight
    this.terminalScrollView.scrollTo({ top: scrollHeight, behavior: 'smooth' })

    if (this.props.isActive && !this.logsInterval) {
      this.startPolling()
    } else if (!this.props.isActive && this.logsInterval) {
      this.stopPolling()
    }
  }

  refreshLogs = async () => {
    const gethLogs = await geth.getLogs()
    const { logs } = this.state
    this.setState({
      ...this.state,
      logs: [...logs, ...gethLogs]
    })
  }

  startPolling = () => {
    this.logsInterval = setInterval(this.refreshLogs, 1000)
  }

  stopPolling = () => {
    clearInterval(this.logsInterval)
    this.logsInterval = null
  }

  render() {
    const { logs } = this.state

    return (
      <div key="terminalContainer">
        <div
          key="terminalWrapper"
          ref={terminalScrollView =>
            (this.terminalScrollView = terminalScrollView)
          }
          style={{
            fontFamily:
              'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
            fontSize: '9px',
            background: '#111',
            color: '#eee',
            maxHeight: 350,
            maxWidth: 680,
            overflowY: 'scroll',
            whiteSpace: 'nowrap',
            padding: 10
          }}
        >
          {logs.map((l, index) => (
            <div key={index}> &gt; {l}</div>
          ))}
          <div ref={endMarker => (this.endMarker = endMarker)} />
        </div>
      </div>
    )
  }
}
