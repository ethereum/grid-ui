import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Ansi from 'ansi-to-react'
import { withStyles } from '@material-ui/core/styles'
import TerminalInput from './TerminalInput'

const styles = () => ({
  terminalWrapper: {
    background: '#111',
    color: '#eee',
    fontFamily:
      'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
    fontSize: '11px',
    padding: 10,

    // Fluid width and height with support to scrolling
    width: 'calc(100vw - 310px)',
    height: 'calc(100vh - 330px)',

    // Scroll config
    overflowX: 'auto',
    overflowY: 'scroll',
    whiteSpace: 'nowrap'
  }
})

class Terminal extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    classes: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      logs: []
    }
    this.terminalScrollViewRef = React.createRef()
  }

  componentDidMount = async () => {
    this.subscribeLogs()
  }

  componentWillReceiveProps({ client: nextClient }) {
    const { client: oldClient } = this.props
    const logs = nextClient.getLogs()
    this.setState({ logs })
    if (oldClient && nextClient !== oldClient) {
      this.unsubscribeLogs(oldClient)
      this.subscribeLogs(nextClient)
    }
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

  clearLogs = newState => {
    if (newState === 'started') {
      this.setState({ logs: [] })
    }
  }

  subscribeLogs = client => {
    // eslint-disable-next-line
    client = client || this.props.client
    client.on('log', this.addNewLog)
    // Clear old logs on restart
    client.on('newState', this.clearLogs)
  }

  unsubscribeLogs = client => {
    // eslint-disable-next-line
    client = client || this.props.client
    client.removeListener('log', this.addNewLog)
    client.removeListener('newState', this.clearLogs)
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
    const { classes, client } = this.props
    const { logs } = this.state

    if (logs.length === 0) {
      return <div>No logs yet.</div>
    }

    const renderLogs = logs.map((l, index) => (
      <div key={index}>
        {' '}
        &gt; <Ansi>{l}</Ansi>
      </div>
    ))

    return (
      <div key="terminalContainer">
        <div
          key="terminalWrapper"
          ref={this.terminalScrollViewRef}
          className={classes.terminalWrapper}
        >
          {renderLogs}
        </div>
        <TerminalInput client={client} addNewLog={this.addNewLog} />
      </div>
    )
  }
}

export default withStyles(styles)(Terminal)
