import { Grid } from '../../API'
import { requestDone } from './actions'
import { updateConfigValue } from '../client/actions'
import { chainIdToNetwork } from '../../lib/utils'

const clef = Grid.PluginHost.plugins.filter(plugin => plugin.name === 'clef')[0]

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

  updateChainId(dispatch, getState, chainId) {
    const method = 'clef_setChainId'
    const params = [chainId]
    this.send(dispatch, method, params)
    dispatch(updateConfigValue('clef', 'chainId', chainId))
    const networkName = chainIdToNetwork(chainId)
    Grid.notify(
      'Clef: Network Updated',
      `Set to ${networkName} (chain ID: ${chainId})`
    )
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
    Grid.notify(title, body)
  }

  notifyNotification(notification) {
    const title = 'Clef Signer'
    const body = notification.text
    Grid.notify(title, body)
  }
}

export default new ClefService()
