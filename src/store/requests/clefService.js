import { Grid } from '../../API'
import { addRequest, requestDone, addNotification } from './actions'

const { clef } = Grid

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
    clef.rpc(method, params, id, result)
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

  // createListeners(dispatch) {
  //   clef.on('approvalRequired', data => this.approvalRequired(data, dispatch))
  //   clef.on('inputRequired', data => this.inputRequired(data, dispatch))
  // }
  //
  // removeListeners() {
  //   clef.removeAllListeners('approvalRequired')
  //   clef.removeAllListeners('inputRequired')
  // }
  //
  // approvalRequired(data, dispatch) {
  //   dispatch(addRequest({ data }))
  // }
  //
  // showInfo(data, dispatch) {
  //   const { text } = data.params[0]
  //   dispatch(addNotification('info', text))
  // }
  //
  // showError(data, dispatch) {
  //   const { text } = data.params[0]
  //   dispatch(addNotification('error', text))
  // }
}

export default new ClefService()
