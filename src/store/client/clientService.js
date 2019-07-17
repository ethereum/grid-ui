import { BigNumber } from 'bignumber.js'
import {
  newBlock,
  updateSyncing,
  clientError,
  onConnectionUpdate,
  updatePeerCount,
  updatePeerCountError
} from './actions'

// Utils
const isHex = str => typeof str === 'string' && str.startsWith('0x')
const hexToNumberString = str => new BigNumber(str).toString(10)
const toNumberString = str => (isHex(str) ? hexToNumberString(str) : str)

class ClientService {
  start(client, release, flags, config, dispatch) {
    client.start(release, flags, config)
    if (client.type === 'client') this.watchForPeers(client, dispatch)
  }

  resume(client, dispatch) {
    if (client.type === 'client') this.watchForPeers(client, dispatch)
    dispatch(onConnectionUpdate(client.name, client.state))

    // `resume` is called for 'STARTED', 'STARTING', and 'CONNECTED' states.
    // If plugin starts as 'CONNECTED', manually trigger `onConnect`.
    if (client.state === 'CONNECTED') {
      this.onConnect(client, dispatch)
    }
  }

  stop(client) {
    client.stop()
    clearInterval(this.peerCountInterval)
    this.unsubscribeSyncingSubscription(client)
    this.unsubscribeNewHeadsSubscription(client)
    this.removeListeners(client)
  }

  watchForPeers(client, dispatch) {
    this.peerCountInterval = setInterval(
      () => this.updatePeerCount(client, dispatch),
      3000
    )
  }

  async updatePeerCount(client, dispatch) {
    const hexPeerCount = await client.rpc('net_peerCount')
    if (hexPeerCount.message) {
      dispatch(updatePeerCountError(client.name, hexPeerCount.message))
    } else {
      const peerCount = toNumberString(hexPeerCount)
      dispatch(updatePeerCount(client.name, peerCount))
    }
  }

  createListeners(client, dispatch) {
    client.on('newState', newState => {
      dispatch(onConnectionUpdate(client.name, newState.toUpperCase()))
      if (newState === 'connected') {
        this.onConnect(client, dispatch)
      }
    })
    client.on('pluginError', error => dispatch(clientError(client.name, error)))
  }

  removeListeners(client) {
    client.removeAllListeners('newState')
    client.removeAllListeners('pluginError')
  }

  onNewHeadsSubscriptionResult(client, result, dispatch) {
    const { result: subscriptionResult } = result
    if (!subscriptionResult) return

    const {
      number: hexBlockNumber,
      timestamp: hexTimestamp
    } = subscriptionResult
    const blockNumber = Number(toNumberString(hexBlockNumber))
    const timestamp = Number(toNumberString(hexTimestamp))
    dispatch(newBlock(client.name, blockNumber, timestamp))
  }

  onSyncingSubscriptionResult(client, result, dispatch) {
    if (result === false) {
      // Stopped syncing, begin newHeads subscription
      this.startNewHeadsSubscription(client, dispatch)
      // Unsubscribe from syncing subscription
      this.unsubscribeSyncingSubscription(client)
      return
    }

    // waiting for syncing data
    if (result === true) return

    const { status } = result
    if (!status) return

    const {
      StartingBlock: startingBlock,
      CurrentBlock: currentBlock,
      HighestBlock: highestBlock,
      KnownStates: knownStates,
      PulledStates: pulledStates
    } = status

    dispatch(
      updateSyncing(client.name, {
        startingBlock,
        currentBlock,
        highestBlock,
        knownStates,
        pulledStates
      })
    )
  }

  unsubscribeNewHeadsSubscription(client) {
    if (!this.newHeadsSubscriptionId) return
    client.rpc('eth_unsubscribe', [this.newHeadsSubscriptionId])
    client.removeListener(
      this.newHeadsSubscriptionId,
      this.onNewHeadsSubscriptionResult
    )
    this.newHeadsSubscriptionId = null
  }

  unsubscribeSyncingSubscription(client) {
    if (!this.syncingSubscriptionId) return
    client.rpc('eth_unsubscribe', [this.syncingSubscriptionId])
    client.removeListener(
      this.syncingSubscriptionId,
      this.onSyncingSubscriptionResult
    )
    this.syncingSubscriptionId = null
  }

  startBlockSubscriptions(client, dispatch) {
    const startSubscriptions = async () => {
      const result = await client.rpc('eth_syncing')
      if (result === false) {
        // Not syncing, start newHeads subscription
        this.startNewHeadsSubscription(client, dispatch)
      } else {
        // Subscribe to syncing
        this.startSyncingSubscription(client, dispatch)
      }
    }

    const setLastBlock = () => {
      client.rpc('eth_getBlockByNumber', ['latest', false]).then(block => {
        const { number: hexBlockNumber, timestamp: hexTimestamp } = block
        const blockNumber = Number(toNumberString(hexBlockNumber))
        const timestamp = Number(toNumberString(hexTimestamp))
        dispatch(newBlock(client.name, blockNumber, timestamp))
      })
    }

    setTimeout(() => {
      setLastBlock()
      startSubscriptions()
    }, 2000)
  }

  onConnect(client, dispatch) {
    if (client.type === 'client') {
      this.startBlockSubscriptions(client, dispatch)
    }
  }

  async startNewHeadsSubscription(client, dispatch) {
    client.rpc('eth_subscribe', ['newHeads']).then(subscriptionId => {
      this.newHeadsSubscriptionId = subscriptionId
      client.on('notification', result => {
        const { subscription } = result
        if (subscription === this.newHeadsSubscriptionId) {
          this.onNewHeadsSubscriptionResult(client, result, dispatch)
        }
      })
    })
  }

  async startSyncingSubscription(client, dispatch) {
    console.log('∆∆∆ startSyncingSubscription')
    const subscriptionId = await client.rpc('eth_subscribe', ['syncing'])
    this.syncingSubscriptionId = subscriptionId
    client.on('notification', result => {
      const { subscription } = result
      if (subscription === this.newHeadsSubscriptionId) {
        console.log('∆∆∆ subscriptionId syncing', subscriptionId, result)
        this.onSyncingSubscriptionResult(client, result, dispatch)
      }
    })
  }
}

export default new ClientService()
