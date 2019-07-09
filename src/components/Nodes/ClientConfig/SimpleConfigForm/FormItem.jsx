import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'

class DynamicConfigFormItem extends Component {
  static propTypes = {
    setting: PropTypes.object.isRequired
  }

  render() {
    const { setting } = this.props
    const { type, label, default: defaultValue } = setting
    const val = defaultValue
    switch (type) {
      case 'select':
        return <span>[select]</span>
      case 'text':
      default:
        return (
          <TextField
            data-test-id={`input-text-${setting.id}`}
            variant="outlined"
            label={label}
            value={val}
            onChange={event => {
              console.log('field changed', event)
            }}
            fullWidth
          />
        )
    }
  }
}

export default DynamicConfigFormItem
