import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Select from '../../shared/Select'

class DynamicConfigForm extends Component {
  static propTypes = {
    isClientRunning: PropTypes.bool,
    settings: PropTypes.object
  }

  constructor(props) {
    super(props)
    const { settings } = props
    this.state = { settings }
  }

  componentDidMount() {}

  noop = event => console.log('event', event)

  wrapGridItem(el, index) {
    return (
      <Grid item xs={6} key={index}>
        {el}
      </Grid>
    )
  }

  renderFormItem(entry, props) {
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
          />
        )
      default:
        return (
          <TextField
            variant="outlined"
            label={label}
            value={item.default}
            disabled={isClientRunning}
            fullWidth
          />
        )
    }
  }

  renderForm() {
    const { settings } = this.state
    const props = this.props
    if (!settings) return <h4>Empty settings pane</h4>

    const formItems = Object.entries(settings)
      .map(entry => this.renderFormItem(entry, props))
      .map(this.wrapGridItem)

    return (
      <Grid container style={{ paddingTop: 15 }} spacing={24}>
        {formItems}
      </Grid>
    )
  }

  render() {
    return <div>{this.renderForm()}</div>
  }
}

export default DynamicConfigForm
