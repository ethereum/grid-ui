import React, { Component } from 'react'

class DynamicConfigForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: {
        dataDir: {
          default: '~/Library/Ethereum/',
          label: 'Data Directory',
          flag: '--datadir %s'
        },
        ipc: {
          default: 'ipc',
          options: [
            {
              value: 'websockets',
              label: 'WebSockets',
              flag: '--ws --wsaddr %s --wsport 8586'
            },
            { value: 'ipc', label: 'IPC', flag: '--rpc' }
          ]
        },
        network: {
          default: '',
          options: [
            { value: 'main', label: 'Main', flag: '' },
            { value: 'ropsten', label: 'Ropsten (testnet)', flag: '--testnet' },
            { value: 'rinkeby', label: 'Rinkeby (testnet)', flag: '--rinkeby' }
          ]
        },
        syncMode: {
          default: 'light',
          options: ['fast', 'full', 'light'],
          flag: '--syncmode "%s"'
        }
      }
    }
  }

  componentDidMount() {}

  renderOptions(el) {}

  renderFormItem(entry) {
    const [key, item] = entry

    const label = item.label || key
    const type = item.options ? 'select' : 'text'

    if (type === 'select') {
      const options = item.options.map(el => {
        let { label, value } = el

        if (typeof el === 'string') {
          label = value = el
        }

        return <option value={value}>{label}</option>
      })

      return <select name={key}> {options} </select>
    }

    return (
      <input
        type="text"
        name={key}
        key={key}
        placeholder={item.label}
        alt={item.label}
        value={item.default}
      />
    )
  }

  render() {
    const { settings } = this.state
    console.log('settings', settings)
    const formItems = Object.entries(settings).map(this.renderFormItem)

    return (
      <div>
        <h3>Dynamic form</h3>
        <div>{formItems}</div>
      </div>
    )
  }
}

export default DynamicConfigForm
