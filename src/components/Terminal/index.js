import React, { Component } from 'react'
import { Terminal } from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
// import * as winptyCompat from 'xterm/lib/addons/winptyCompat/winptyCompat'
import 'xterm/dist/xterm.css'
import { Grid } from '../../API'

Terminal.applyAddon(fit)
// Terminal.applyAddon(winptyCompat)

export default class XTerminal extends Component {
  componentDidMount() {
    const { props } = this
    this.termOptions = {
      cols: 30,
      rows: 30
    }
    this.term = new Terminal(this.termOptions)

    // The parent element for the terminal is attached and removed manually so
    // that we can preserve it across mounts and unmounts of the component
    this.termRef = props.term
      ? props.term._core._parent
      : document.createElement('div')
    this.termRef.className = 'term_fit term_term'

    this.termWrapperRef.appendChild(this.termRef)

    this.term.open(this.termRef)

    // this.term.fit() // calculate rows and cols to make it fit the window (fit plugin)
    try {
      this.init()
        .then(() => console.log('xterm initialized'))
        .catch(err => console.error('could not initialize xterm', err))
    } catch (error) {
      console.error('could not initialize xterm', error)
    }
  }

  componentWillUnmount() {
    // terms[this.props.uid] = null;
    this.termWrapperRef.removeChild(this.termRef)
    this.props.ref_(this.props.uid, null)

    // to clean up the terminal, we remove the listeners
    // instead of invoking `destroy`, since it will make the
    // term insta un-attachable in the future (which we need
    // to do in case of splitting, see `componentDidMount`
    this.disposableListeners.forEach(handler => handler.dispose())
    this.disposableListeners = []
  }

  fitResize() {
    if (!this.termWrapperRef) {
      return
    }
    this.term.fit()
  }

  onTermWrapperRef = component => {
    this.termWrapperRef = component

    if (component) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeTimeout) {
          return
        }
        this.resizeTimeout = setTimeout(() => {
          delete this.resizeTimeout
          this.fitResize()
        }, 0)
      })
      this.resizeObserver.observe(component)
    } else {
      this.resizeObserver.disconnect()
    }
  }

  init = async () => {
    this.term.setOption('fontSize', 12)
    this.term.setOption('letterSpacing', 2)
    this.term.setOption('lineHeight', 1)
    this.term.setOption('cursorBlink', true)
    this.term.setOption(
      'fontFamily',
      'Menlo, "DejaVu Sans Mono", "Lucida Console", monospace'
    )
    this.term.setOption('theme', {
      background: '#111'
    })
    const term = this.term

    // const args = (Grid && Grid.window && Grid.window.getArgs()) || {}
    // const { client: clientName } = args.scope
    const clientName = 'geth'
    const client = Grid.PluginHost.getPluginByName(clientName)
    term.writeln(
      `***** Ethereum Grid: Emulated Terminal for "${client.displayName}" *****`
    )
    const { binaryPath } = await client.getLocalBinary()
    // TODO handle binary not available
    console.log('bin path', binaryPath)
    term.writeln(binaryPath)

    const ptyProcess = await client.startPtyProcess()
    // Setup communication between xterm.js and node-pty
    term.on('data', data => {
      ptyProcess.write(data)
    })
    ptyProcess.on('data', function(data) {
      term.write(data)
    })
  }
  render() {
    return (
      <div
        ref={this.onTermWrapperRef}
        className="term_fit term_wrapper"
        style={{
          display: 'block',
          height: '100%',
          width: '100%',
          background: 'grey'
        }}
      />
    )
  }
}
