import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'

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
      input: ''
    }
  }

  handleChange = event => {
    this.setState({ input: event.target.value })
  }

  submit = () => {
    const { client, addNewLog } = this.props
    const { input } = this.state
    client.write(input)
    addNewLog(input)
    this.setState({ input: '' })
  }

  render() {
    const { classes, client } = this.props
    const { input } = this.state

    const isClientRunning = ['STARTED', 'CONNECTED'].includes(client.state)

    if (!isClientRunning) {
      return null
    }

    return (
      <form onSubmit={this.submit}>
        <TextField
          data-test-id="terminal-input"
          value={input}
          onChange={this.handleChange}
          disabled={!isClientRunning}
          className={classes.textField}
          InputProps={{
            className: classes.input,
            startAdornment: (
              <InputAdornment
                position="start"
                className={classes.inputAdornment}
              >
                <Typography className={classes.inputAdornment}>&gt;</Typography>
              </InputAdornment>
            )
          }}
          fullWidth
        />
      </form>
    )
  }
}

export default withStyles(styles)(TerminalInput)
