import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Select from '../../shared/Select'

class DynamicConfigForm extends Component {
  static propTypes = {
    handleClientConfigChanged: PropTypes.func.isRequired,
    settings: PropTypes.array
  }

  wrapGridItem = (el, index) => {
    return (
      <Grid item xs={6} key={index}>
        {el}
      </Grid>
    )
  }

  handleChange = (key, value) => {
    const { handleClientConfigChanged } = this.props
    handleClientConfigChanged(key, value)
  }

  renderFormItem = (entry, props) => {
    const { isClientRunning } = props
    const label = entry.label || entry.id
    const type = entry.options ? 'select' : 'text'
    let options

    switch (type) {
      case 'select':
        options = entry.options.map(el => {
          let optionLabel
          let optionValue

          if (typeof el === 'string') {
            // eg: ['light', 'full', 'fast']
            optionLabel = el
            optionValue = el
          } else if (typeof el === 'object') {
            // eg: [{label: 'Ropsten test network', value: 'Ropsten', flag: '--testnet'}]
            optionLabel = el.label
            optionValue = el.value
          } else {
            throw Error(`el was not properly set: ${el}`)
          }

          return {
            label: optionLabel,
            value: optionValue
          }
        })

        return (
          <div data-test-id={`input-select-${entry.id}`}>
            <Select
              name={label}
              defaultValue={entry.default}
              options={options}
              disabled={isClientRunning}
              onChange={value => this.handleChange(entry.id, value)}
            />
          </div>
        )
      default:
        return (
          <TextField
            variant="outlined"
            label={label}
            defaultValue={entry.default}
            disabled={isClientRunning}
            fullWidth
            data-test-id={`input-text-${entry.id}`}
            onChange={e => this.handleChange(entry.id, e.target.value)}
          />
        )
    }
  }

  render() {
    const { settings } = this.props
    if (settings.length === 0) return <h4>No settings found</h4>

    const formItems = settings
      .map(entry => this.renderFormItem(entry, this.props))
      .map(this.wrapGridItem)

    return (
      <Grid container style={{ paddingTop: 15 }} spacing={24}>
        {formItems}
      </Grid>
    )
  }
}

export default DynamicConfigForm
