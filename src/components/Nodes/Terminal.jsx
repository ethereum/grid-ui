import React, { Component } from 'react'

export default class Terminal extends Component {
  state = {
    logs: []
  }

  constructor(props) {
    super(props)
    this.terminalScrollViewRef = React.createRef()
  }

  componentDidMount = async () => {
    this.subscribeLogs()
  }

  componentWillReceiveProps({ client: nextClient }, old) {
    let { client: oldClient } = this.props
    let logs = []
    if (oldClient && nextClient != oldClient) {
      console.log('unsubscribe')
      this.unsubscribeLogs(oldClient)
      logs = nextClient.getLogs()
      this.subscribeLogs(nextClient)
    }
    this.setState({
      logs
    })
  }

  componentDidUpdate = () => {
    this.terminalScrollToBottom()
  }

  componentWillUnmount() {
    this.unsubscribeLogs()
  }

  addNewLog = async newLog => {
    const { logs } = this.state
    this.setState({
      logs: [...logs, newLog]
    })
  }

  clearLogs = () => {
    this.setState({ logs: [] })
  }

  subscribeLogs = client => {
    client = client || this.props.client
    client.on('log', this.addNewLog)
    // Clear old logs on restart
    client.on('starting', this.clearLogs)
  }

  unsubscribeLogs = client => {
    client = client || this.props.client
    client.removeListener('log', this.addNewLog)
    client.removeListener('started', this.clearLogs)
  }

  terminalScrollToBottom = () => {
    const scrollView = this.terminalScrollViewRef.current
    if (!scrollView) {
      return
    }
    const { scrollHeight } = scrollView
    scrollView.scrollTo({
      top: scrollHeight,
      behavior: 'smooth'
    })
  }

  render() {
    const { logs } = this.state

    return (
      <div key="terminalContainer">
        <div
          key="terminalWrapper"
          ref={this.terminalScrollViewRef}
          style={{
            fontFamily:
              'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
            fontSize: '11px',
            background: '#111',
            color: '#eee',
            maxHeight: 400,
            width: '100%',
            overflowY: 'scroll',
            whiteSpace: 'nowrap',
            padding: 10
          }}
        >
          {logs.map((l, index) => (
            <div key={index}> &gt; {l}</div>
          ))}
        </div>
      </div>
    )
  }
}
