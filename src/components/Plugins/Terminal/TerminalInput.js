import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

const styles = () => ({
  textField: {
    paddingRight: '2px'
  },
  inputAdornment: {
    color: '#eee',
    paddingLeft: '2px'
  },
  input: {
    background: '#111',
    color: '#eee',
    fontFamily:
      'Lucida Console, Lucida Sans Typewriter, monaco, Bitstream Vera Sans Mono, monospace',
    fontSize: '11px',
    overflowX: 'auto',
    padding: '5px'
  }
})

class TerminalInput extends Component {
  static propTypes = {
    client: PropTypes.object.isRequired,
    addNewLog: PropTypes.func,
    classes: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      input: '',
      history: [''],
      historyIndex: 0,
      protectInput: false
    }
  }

  toggleProtect = event => {
    this.setState({ protectInput: event.target.checked })
  }

  handleChange = event => {
    this.setState({ input: event.target.value })
  }

  handleKeyDown = event => {
    // On up or down arrow, navigate through history
    if (event.keyCode === 38 || event.keyCode === 40) {
      event.preventDefault()
      const { history, historyIndex } = this.state
      let newIndex = historyIndex
      if (event.keyCode === 38) {
        // up arrow
        newIndex += 1
        if (newIndex > history.length) {
          newIndex = 0
        }
      } else if (event.keyCode === 40) {
        // down arrow
        newIndex -= 1
        if (newIndex < 0) {
          newIndex = history.length
        }
      }
      const input = history[history.length - newIndex]
      this.setState({ input, historyIndex: newIndex })
    }
  }

  submit = () => {
    const { client, addNewLog } = this.props
    const { input, history, protectInput } = this.state
    client.write(input)
    addNewLog(protectInput ? '***' : input)
    this.setState({ input: '', historyIndex: 0 })
    // Add to history if not same as last history entry
    if (history[-1] !== input) {
      const newHistory = [...history, input]
      this.setState({ history: newHistory })
    }
  }

  render() {
    const { classes, client } = this.props
    const { input, protectInput } = this.state

    const isClientRunning = ['STARTED', 'CONNECTED'].includes(client.state)

    if (!isClientRunning) {
      return null
    }

    return (
      <form onSubmit={this.submit}>
        <FormGroup row>
          <TextField
            data-test-id="terminal-input"
            value={input}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            disabled={!isClientRunning}
            className={classes.textField}
            type={protectInput ? 'password' : 'text'}
            InputProps={{
              className: classes.input,
              startAdornment: (
                <InputAdornment
                  position="start"
                  className={classes.inputAdornment}
                >
                  <Typography className={classes.inputAdornment}>
                    &gt;
                  </Typography>
                </InputAdornment>
              )
            }}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={protectInput}
                onChange={this.toggleProtect}
                style={{ marginLeft: 10 }}
              />
            }
            label="Hide Input"
          />
        </FormGroup>
      </form>
    )
  }
}

export default withStyles(styles)(TerminalInput)
