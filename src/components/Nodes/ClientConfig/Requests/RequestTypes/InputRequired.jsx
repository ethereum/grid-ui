import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import RequestInfo from './RequestInfo'

const styles = () => ({})

class InputRequired extends Component {
  static propTypes = {
    send: PropTypes.func,
    request: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }

  handleChangeText = event => {
    const text = event.target.value
    this.setState({ text })
  }

  handleSubmit = () => {
    const { request, send } = this.props
    const { text } = this.state
    const { id } = request
    const result = { text }
    send(null, [], id, result)
  }

  render() {
    const { request } = this.props
    const { text } = this.state
    const { title, prompt, isPassword } = request.params[0]
    return (
      <div>
        <Typography variant="h5" style={{ marginTop: 20 }}>
          {title}
        </Typography>
        <RequestInfo request={request} />
        <Typography variant="body1" style={{ marginTop: 10 }}>
          {prompt}
        </Typography>
        <TextField
          value={text}
          placeholder="Enter your response"
          type={isPassword ? 'password' : 'text'}
          onChange={this.handleChangeText}
          style={{ marginTop: 10, marginBottom: 10, width: 300 }}
        />
        <div>
          <Button
            color="primary"
            onClick={() => {
              this.handleSubmit()
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(withStyles(styles)(InputRequired))
