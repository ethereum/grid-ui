import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Select from '../../shared/Select'

class DynamicConfigForm extends Component {
  constructor(props) {
    super(props)
    const { settings } = props
    this.state = { settings }
  }

  componentDidMount() {}

  noop = event => console.log('event', event)

  renderFormItem(entry) {
    const [key, item] = entry

    const label = item.label || key
    const type = item.options ? 'select' : 'text'

    switch (type) {
      case 'select':
        const options = item.options.map(el => {
          // eg: [{label: 'Ropsten test network', value: 'Ropsten', flag: '--testnet'}]
          let { label, value } = el

          // eg: ['light', 'full', 'fast']
          if (typeof el === 'string') label = value = el

          return { label, value }
        })

        return (
          <Select name={label} defaultValue={item.default} options={options} />
        )
      default:
        return (
          <TextField
            variant="outlined"
            label={label}
            value={item.default}
            fullWidth
          />
        )
    }
  }

  wrapGridItem(el, index) {
    return (
      <Grid item xs={6} key={index}>
        {el}
      </Grid>
    )
  }

  renderForm() {
    const { settings } = this.state
    if (!settings) return <h4>Empty settings pane</h4>

    const formItems = Object.entries(settings)
      .map(this.renderFormItem)
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
