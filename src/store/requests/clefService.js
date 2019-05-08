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
    const title = 'Clef Signer'
    let body = 'New Request'
    switch (request.method) {
      case 'ui_onInputRequired': {
        const { title: requestTitle, prompt: requestPrompt } = request.params[0]
        body = `${requestTitle}: ${requestPrompt}`
        break
      }
      case 'ui_approveTx':
        body = 'New Transaction Request'
        break
      case 'ui_approveSignData':
        body = 'New Sign Data Request'
        break
      case 'ui_approveNewAccount':
        body = 'New Account Request'
        break
      case 'ui_approveListing':
        body = 'New Account Listing Request'
        break
      default:
        break
    }
    Mist.notify(title, body)
  }

  notifyNotification(notification) {
    const title = 'Clef Signer'
    let body
    switch (notification.method) {
      case 'ui_showInfo':
        body = `Info: ${notification.params[0].text}`
        break
      case 'ui_showError':
        body = `Error: ${notification.params[0].text}`
        break
      case 'ui_onApprovedTx':
        body = 'Transaction Approved'
        break
      case 'ui_onSignerStartup': {
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
