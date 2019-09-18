import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { withSnackbar } from 'notistack'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import {
  dismissFlagWarning,
  setCustomFlags
} from '../../../../store/plugin/actions'

class FlagPreview extends Component {
  static propTypes = {
    plugin: PropTypes.object,
    isPluginRunning: PropTypes.bool,
    flags: PropTypes.array,
    isEditingFlags: PropTypes.bool,
    toggleEditGeneratedFlags: PropTypes.func,
    dispatch: PropTypes.func,
    showWarning: PropTypes.bool,
    enqueueSnackbar: PropTypes.func,
    closeSnackbar: PropTypes.func
  }

  constructor(props) {
    super(props)

    // NOTE: for performance, form fields are populated by local state.
    // Redux state doesn't need to update on every keystroke.
    this.updateRedux = debounce(this.updateRedux, 500)
    this.state = {
      flags: props.flags.join(' '),
      warningHasBeenShown: false
    }
  }

  componentDidUpdate = () => {
    const { warningHasBeenShown } = this.state
    const {
      isEditingFlags,
      showWarning,
      enqueueSnackbar,
      closeSnackbar
    } = this.props
    if (isEditingFlags && showWarning && !warningHasBeenShown) {
      this.setState({ warningHasBeenShown: true }, () => {
        enqueueSnackbar("Use caution! Don't take flags from strangers.", {
          variant: 'warning',
          onClose: () => {
            this.dismissFlagWarning()
          },
          action: key => (
            <Fragment>
              <Button
                style={{ color: '#000' }}
                onClick={() => {
                  closeSnackbar(key)
                  this.dismissFlagWarning()
                }}
              >
                {'Dismiss'}
              </Button>
            </Fragment>
          )
        })
      })
    }
  }

  toggleEdit = event => {
    const { toggleEditGeneratedFlags } = this.props
    toggleEditGeneratedFlags(event.target.checked)
  }

  handleChange = event => {
    const { plugin } = this.props
    const pluginName = plugin[plugin.selected].name
    const flags = event.target.value
    this.setState({ flags })
    this.updateRedux(pluginName, flags)
  }

  updateRedux = (pluginName, flags) => {
    const { dispatch } = this.props
    dispatch(setCustomFlags(pluginName, flags.split(' ')))
  }

  dismissFlagWarning = () => {
    const { dispatch } = this.props
    dispatch(dismissFlagWarning())
  }

  render() {
    const { isEditingFlags, isPluginRunning } = this.props
    const { flags } = this.state

    return (
      <React.Fragment>
        <FormGroup row>
          <TextField
            label="Generated Flags"
            variant="outlined"
            multiline
            value={flags}
            onChange={this.handleChange}
            disabled={isPluginRunning || !isEditingFlags}
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={isEditingFlags}
                onChange={this.toggleEdit}
                disabled={isPluginRunning}
                style={{ marginLeft: 10 }}
              />
            }
            label="Use custom flags"
          />
        </FormGroup>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    showWarning: state.plugin.showCustomFlagWarning
  }
}

export default connect(mapStateToProps)(withSnackbar(FlagPreview))
