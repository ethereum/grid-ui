import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Select from '../../shared/Select'

class DynamicConfigForm extends Component {
  static propTypes = {
    handleClientConfigChanged: PropTypes.func,
    settings: PropTypes.object
  }

  noop = event => console.log('event', event)

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
    const [key, item] = entry
    const label = item.label || key
    const type = item.options ? 'select' : 'text'
    let options

    switch (type) {
      case 'select':
        options = item.options.map(el => {
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
          <Select
            name={label}
            defaultValue={item.default}
            options={options}
            disabled={isClientRunning}
            onChange={value => this.handleChange(key, value)}
          />
        )
      default:
        return (
          <TextField
            variant="outlined"
            label={label}
            defaultValue={item.default}
            disabled={isClientRunning}
            fullWidth
            onChange={e => this.handleChange(key, e.target.value)}
          />
        )
    }
  }

  render() {
    const { settings } = this.props
    if (!settings) return <h4>No configuration settings found</h4>

    const formItems = Object.entries(settings)
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
