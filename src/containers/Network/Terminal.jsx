import React, { Component } from 'react'
import { Mist } from '../../API'

const { geth } = Mist

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

export default class Terminal extends Component {
  state = {
    logs: []
  }

  componentDidMount = async () => {
    const refreshLogs = async () => {
      const gethLogs = await geth.getLogs()
      const { logs } = this.state
      this.setState({
        logs: [...logs, ...gethLogs]
      })
    }
    await refreshLogs()
    setInterval(refreshLogs, 1000)
  }

  render() {
    const { logs } = this.state
    return (
      <div>
        <div
          style={{
            fontFamily:
              'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
            fontSize: 11,
            background: '#111',
            color: '#eee',
            maxHeight: 350,
            maxWidth: 680,
            overflowY: 'scroll',
            whiteSpace: 'nowrap',
            padding: 10
          }}
        >
          {logs.map(l => (
            <div key={getRandomArbitrary(0, 1000000000)}> &gt; {l}</div>
          ))}
        </div>
      </div>
    )
  }
}
