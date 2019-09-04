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
    maxWidth: '100%',
    height: 'calc(100vh - 330px)',

    // Scroll config
    overflowX: 'auto',
    overflowY: 'auto',
    whiteSpace: 'nowrap'
  }
})

class Terminal extends Component {
  static propTypes = {
    plugin: PropTypes.object.isRequired,
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

  componentWillReceiveProps({ plugin: nextPlugin }) {
    const { plugin: oldPlugin } = this.props
    const logs = nextPlugin.getLogs()
    this.setState({ logs })
    if (oldPlugin && nextPlugin !== oldPlugin) {
      this.unsubscribeLogs(oldPlugin)
      this.subscribeLogs(nextPlugin)
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

  subscribeLogs = plugin => {
    // eslint-disable-next-line
    plugin = plugin || this.props.plugin
    plugin.on('log', this.addNewLog)
    // Clear old logs on restart
    plugin.on('newState', this.clearLogs)
  }

  unsubscribeLogs = plugin => {
    // eslint-disable-next-line
    plugin = plugin || this.props.plugin
    plugin.removeListener('log', this.addNewLog)
    plugin.removeListener('newState', this.clearLogs)
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
    const { classes, plugin } = this.props
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
        <TerminalInput plugin={plugin} addNewLog={this.addNewLog} />
      </div>
    )
  }
}

export default withStyles(styles)(Terminal)
