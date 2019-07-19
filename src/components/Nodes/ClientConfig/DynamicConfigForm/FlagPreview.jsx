import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { setCustomFlags } from '../../../../store/client/actions'

class FlagPreview extends Component {
  static propTypes = {
    client: PropTypes.object,
    isClientRunning: PropTypes.bool,
    flags: PropTypes.array,
    editGeneratedFlags: PropTypes.bool,
    toggleEditGeneratedFlags: PropTypes.func,
    dispatch: PropTypes.func
  }

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
    const { flags, editGeneratedFlags, isClientRunning } = this.props

    return (
      <FormGroup row>
        <TextField
          label="Generated Flags"
          variant="outlined"
          value={flags.join(' ')}
          onChange={this.handleChange}
          disabled={!editGeneratedFlags}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={editGeneratedFlags}
              onChange={this.toggleEdit}
              disabled={isClientRunning}
              style={{ marginLeft: 10 }}
            />
          }
          label="Edit"
        />
      </FormGroup>
    )
  }
}

function mapStateToProps() {
  return {}
}

export default connect(mapStateToProps)(FlagPreview)
