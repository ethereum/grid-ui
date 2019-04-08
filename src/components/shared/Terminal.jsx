import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '../../API'

const { geth, clef } = Grid

export default class Terminal extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['geth', 'clef'])
  }

  state = {
    logs: []
  }

  constructor(props) {
    super(props)
    this.terminalScrollViewRef = React.createRef()
    this.service = geth
    if (props.type === 'clef') {
      this.service = clef
    }
  }

  componentDidMount = async () => {
    this.subscribeLogs()
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

  subscribeLogs = () => {
    this.service.on('log', this.addNewLog)
    // Clear old logs on restart
    this.service.on('starting', this.clearLogs)
  }

  unsubscribeLogs = () => {
    this.service.removeListener('log', this.addNewLog)
    this.service.removeListener('started', this.clearLogs)
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
            maxWidth: '700px',
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
