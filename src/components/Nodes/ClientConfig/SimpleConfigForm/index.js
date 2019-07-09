import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Grid from '@material-ui/core/Grid'
import FormGroup from '@material-ui/core/FormGroup'
import TextField from '@material-ui/core/TextField'
import FormItem from './FormItem'

class DynamicConfigForm extends Component {
  static propTypes = {
    clientPlugin: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  /**
   * For every setting as defined in the plugin config
   * we generate a form field and render it in the settings grid
   */
  renderSetting = (setting, idx) => {
    return (
      <Grid item xs={6} key={idx}>
        <FormItem setting={setting} />
      </Grid>
    )
  }

  render() {
    const { clientPlugin } = this.props
    const { settings } = clientPlugin
    const flags = []
    if (!settings) return <h4>No configuration settings found</h4>
    return (
      <div>
        <Grid
          container
          style={{ paddingTop: 15, paddingBottom: 15 }}
          spacing={24}
        >
          {settings.map((setting, idx) => this.renderSetting(setting, idx))}
        </Grid>
        <hr />
        <FormGroup row>
          <TextField
            label="Generated Flags"
            variant="outlined"
            value={flags.join(' ')}
            onChange={this.handleChange}
            fullWidth
          />
        </FormGroup>
      </div>
    )
  }
}

export default DynamicConfigForm
