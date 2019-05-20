import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import Select from '../../../shared/Select'
import { Grid as GridAPI } from '../../../../API'

class DynamicConfigFormItem extends Component {
  static propTypes = {
    itemKey: PropTypes.string,
    item: PropTypes.object,
    client: PropTypes.object,
    clientName: PropTypes.string,
    isClientRunning: PropTypes.bool,
    handleClientConfigChanged: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.inputOpenFileRef = React.createRef()
  }

  browseDir = key => async event => {
    const { openFolderDialog } = GridAPI
    // If we don't have openFolderDialog from Grid,
    // return true to continue with native file dialog
    if (!openFolderDialog) {
      return true
    }
    event.preventDefault()
    // Continue with Grid.openFolderDialog()
    const { client, clientName } = this.props
    const defaultPath = client[clientName].config[key]
    const dir = await openFolderDialog(defaultPath)
    this.handleChange(key, dir)
    return null
  }

  handleChange = (key, value) => {
    const { handleClientConfigChanged } = this.props
    handleClientConfigChanged(key, value)
  }

  render() {
    const { itemKey, item, client, clientName, isClientRunning } = this.props
    const label = item.label || itemKey
    let { type } = item
    if (!type) type = item.options ? 'select' : 'text'
    const itemValue = client[clientName].config[itemKey] || item.default
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

          return { label: optionLabel, value: optionValue }
        })

        return (
          <div data-test-id={`input-select-${item.id}`}>
            <Select
              name={label}
              defaultValue={itemValue}
              options={options}
              disabled={isClientRunning}
              onChange={value => this.handleChange(itemKey, value)}
            />
          </div>
        )
      case 'path':
        return (
          <div>
            <TextField
              data-test-id={`input-path-${item.id}`}
              variant="outlined"
              label={item.label}
              value={itemValue || ''}
              onChange={event => this.handleChange(itemKey, event.target.value)}
              disabled={isClientRunning}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={isClientRunning}
                      aria-label="Open folder browser"
                      onClick={() => {
                        if (
                          this.inputOpenFileRef &&
                          this.inputOpenFileRef.current
                        ) {
                          this.inputOpenFileRef.current.click()
                        }
                      }}
                    >
                      <FolderOpenIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              fullWidth
            />
            <input
              type="file"
              id="open-file-dialog"
              onChange={event =>
                this.handleChange(itemKey, event.target.files[0].path)
              }
              onClick={this.browseDir(itemKey)}
              ref={this.inputOpenFileRef}
              style={{ display: 'none' }}
              webkitdirectory="true"
              directory="true"
            />
          </div>
        )
      default:
        return (
          <TextField
            data-test-id={`input-text-${item.id}`}
            variant="outlined"
            label={label}
            value={itemValue}
            disabled={isClientRunning}
            onChange={event => this.handleChange(itemKey, event.target.value)}
            fullWidth
          />
        )
    }
  }
}

export default DynamicConfigFormItem
