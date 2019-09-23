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
import Grid from '@material-ui/core/Grid'
import {
  dismissFlagWarning,
  restoreDefaultSettings,
  setCustomFlags
} from '../../../../store/plugin/actions'
import { getDefaultFlags } from '../../../../lib/utils'

class FlagPreview extends Component {
  static propTypes = {
    config: PropTypes.object,
    plugin: PropTypes.object,
    pluginName: PropTypes.string,
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
    this.defaultFlags = getDefaultFlags(props.plugin, props.config).join(' ')
    this.state = {
      flags: props.flags.join(' '),
      warningHasBeenShown: false
    }
  }

  componentDidUpdate() {
    const { flags: localFlags, warningHasBeenShown } = this.state
    const { flags, isEditingFlags, showWarning } = this.props

    if (isEditingFlags && showWarning && !warningHasBeenShown) {
      this.handleShowWarning()
    }

    // If props update from outside of this component,
    // e.g. restore defaults, update local state
    const newFlags = flags.join(' ')
    if (localFlags !== newFlags && !isEditingFlags) {
      this.updateFlags(newFlags)
    }
  }

  componentWillUnmount() {
    this.updateRedux.cancel()
  }

  updateFlags = flags => {
    this.setState({ flags })
  }

  handleShowWarning = () => {
    const { closeSnackbar, enqueueSnackbar } = this.props

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

  toggleEdit = event => {
    const { toggleEditGeneratedFlags } = this.props
    toggleEditGeneratedFlags(event.target.checked)
  }

  handleChange = event => {
    const flags = event.target.value
    const { pluginName } = this.props
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

  handleRestoreDefaultSettings = () => {
    const { dispatch, plugin, closeSnackbar, enqueueSnackbar } = this.props
    this.setState({ flags: this.defaultFlags }, () => {
      dispatch(restoreDefaultSettings(plugin))
      enqueueSnackbar('Default settings restored!', {
        variant: 'success',
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
        </FormGroup>
        <Grid container style={{ marginTop: 5, marginBottom: 15 }}>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <Button
              style={{ marginTop: 5 }}
              color="primary"
              onClick={this.handleRestoreDefaultSettings}
            >
              Restore Defaults
            </Button>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    pluginName: state.plugin.selected,
    showWarning: state.plugin.showCustomFlagWarning
  }
}

export default connect(mapStateToProps)(withSnackbar(FlagPreview))
