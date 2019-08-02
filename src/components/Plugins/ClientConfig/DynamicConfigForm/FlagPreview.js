import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { setCustomFlags } from '../../../../store/plugin/actions'
import Notification from '../../../shared/Notification'

class FlagPreview extends Component {
  static propTypes = {
    client: PropTypes.object,
    isClientRunning: PropTypes.bool,
    flags: PropTypes.array,
    isEditingFlags: PropTypes.bool,
    toggleEditGeneratedFlags: PropTypes.func,
    dispatch: PropTypes.func
  }

  state = { showWarning: true }

  toggleEdit = event => {
    const { toggleEditGeneratedFlags } = this.props
    toggleEditGeneratedFlags(event.target.checked)
  }

  handleChange = event => {
    const { dispatch, client } = this.props
    const flags = event.target.value.split(' ')
    const clientName = client[client.selected].name
    dispatch(setCustomFlags(clientName, flags))
  }

  render() {
    const { flags, isEditingFlags, isClientRunning } = this.props
    const { showWarning } = this.state

    return (
      <React.Fragment>
        <FormGroup row>
          <TextField
            label="Generated Flags"
            variant="outlined"
            value={flags.join(' ')}
            onChange={this.handleChange}
            disabled={!isEditingFlags}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={isEditingFlags}
                onChange={this.toggleEdit}
                disabled={isClientRunning}
                style={{ marginLeft: 10 }}
              />
            }
            label="Use custom flags"
          />
        </FormGroup>
        {isEditingFlags && showWarning && (
          <Notification
            type="warning"
            message="Use caution! Don't take flags from strangers."
            onDismiss={() => this.setState({ showWarning: false })}
          />
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(FlagPreview)
