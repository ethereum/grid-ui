import { Mist } from '../../API'
import { requestDone } from './actions'

const clef = Mist.PluginHost.plugins.filter(plugin => plugin.name === 'clef')[0]

// Helpers
const networkToChainId = network => {
  switch (network.toLowerCase()) {
    case 'main':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'goerli':
      return 5
    case 'kovan':
      return 42
    case 'private':
      return 1337
    default:
      throw new Error('Unsupported Network: ', network)
  }
}

class ClefService {
  send(dispatch, method, params = [], id, result) {
    const payload = { jsonrpc: '2.0', id }
    if (result) {
      payload.result = result
    } else {
      payload.method = method
      payload.params = params
    }
    clef.write(payload)
    if (id) {
      dispatch(requestDone(id))
    }
  }

  sendSigner(data, config) {
    const { rpcHost, rpcPort } = config
    const address = `http://${rpcHost}:${rpcPort}`
    const body = JSON.stringify(data)
    fetch(address, {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      method: 'POST',
      body
    })
  }

  updateChainId(chainId) {
    this.sendClef({ method: 'clef_setChainId', params: [chainId] })
  }

  notifyRequest(request) {
    let title = 'New Clef Request'
    let body
    switch (request.method) {
      case 'ui_onInputRequired': {
        const { title: requestTitle, prompt: requestPrompt } = request.params[0]
        title = requestTitle
        body = requestPrompt
        break
      }
      case 'ui_approveTx':
        title = 'New Transaction Request'
        body = 'Click to review'
        break
      case 'ui_approveSignData':
        title = 'New Sign Data Request'
        body = 'Click to review'
        break
      case 'ui_approveNewAccount':
        title = 'New Account Request'
        body = 'Click to review'
        break
      case 'ui_approveListing':
        title = 'Account Listing Request'
        break
      default:
        break
    }
    Mist.notify(title, body)
  }

  notifyNotification(notification) {
    let title = 'New Clef Notification'
    let body
    switch (notification.method) {
      case 'ui_showInfo':
        title = 'Clef Notification'
        body = notification.params[0].text
        break
      case 'ui_showError':
        title = 'Clef Error'
        body = notification.params[0].text
        break
      case 'ui_onApprovedTx':
        title = 'Transaction Approved'
        break
      case 'ui_onSignerStartup': {
        title = 'Clef Started'
        const { info } = notification.params[0]
        const httpAddress = info.extapi_http
        const ipcAddress = info.extapi_ipc
        body = 'Started on'
        if (httpAddress !== 'n/a') {
          body += ` ${httpAddress}`
        }
        if (ipcAddress !== 'n/a') {
          body += ` ${ipcAddress}`
        }
        break
      }
      default:
        break
    }
    Mist.notify(title, body)
  }
}

export default new ClefService()
