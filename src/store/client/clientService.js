import { BigNumber } from 'bignumber.js'
import {
  // newBlock, updateSyncing
  clientError,
  onConnectionUpdate,
  updatePeerCount
} from './actions'

// Utils
const isHex = str => typeof str === 'string' && str.startsWith('0x')
const hexToNumberString = str => new BigNumber(str).toString(10)
const toNumberString = str => (isHex(str) ? hexToNumberString(str) : str)

class ClientService {
  start(client, release, config, dispatch) {
    client.start(release, config)
    this.watchForPeers(client, dispatch)
    this.createListeners(client, dispatch)
  }

  resume(client, dispatch) {
    this.watchForPeers(client, dispatch)
    this.createListeners(client, dispatch)
    dispatch(onConnectionUpdate(client.name, 'CONNECTED'))
  }

  stop(client) {
    client.stop()
    clearInterval(this.peerCountInterval)
    // this.unsubscribeSyncingSubscription(this.syncingSubscriptionId)
    // this.unsubscribeNewHeadsSubscription(this.newHeadsSubscriptionId)
    this.removeListeners()
  }

  watchForPeers(client, dispatch) {
    this.peerCountInterval = setInterval(
      () => this.updatePeerCount(client, dispatch),
      3000
    )
  }

  async updatePeerCount(client, dispatch) {
    const hexPeerCount = await client.rpc('net_peerCount')
    const peerCount = toNumberString(hexPeerCount)
    dispatch(updatePeerCount(client.name, peerCount))
  }

  createListeners(client, dispatch) {
    client.on('starting', () =>
      dispatch(onConnectionUpdate(client.name, 'STARTING'))
    )
    client.on('started', () =>
      dispatch(onConnectionUpdate(client.name, 'STARTED'))
    )
    client.on('connected', () =>
      dispatch(onConnectionUpdate(client.name, 'CONNECTED'))
    )
    client.on('stopping', () =>
      dispatch(onConnectionUpdate(client.name, 'STOPPING'))
    )
    client.on('stopped', () =>
      dispatch(onConnectionUpdate(client.name, 'STOPPED'))
    )
    client.on('disconnect', () =>
      dispatch(onConnectionUpdate(client.name, 'DISCONNETED'))
    )
    client.on('error', e => dispatch(clientError(e)))
  }

  removeListeners(client) {
    client.removeAllListeners('starting')
    client.removeAllListeners('started')
    client.removeAllListeners('connected')
    client.removeAllListeners('stopping')
    client.removeAllListeners('stopped')
    client.removeAllListeners('disconnect')
    client.removeAllListeners('error')
  }
}

export default new ClientService()
