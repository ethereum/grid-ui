import { BigNumber } from 'bignumber.js'
import {
  newBlock,
  updateSyncing,
  clientError,
  onConnectionUpdate,
  updatePeerCount
} from './actions'

// Utils
const isHex = str => typeof str === 'string' && str.startsWith('0x')
const hexToNumberString = str => new BigNumber(str).toString(10)
const toNumberString = str => (isHex(str) ? hexToNumberString(str) : str)

// TODO: store 'client' and 'dispatch' on start/resume?

class ClientService {
  start(client, release, config, dispatch) {
    client.start(release, config)
    this.watchForPeers(client, dispatch)
    this.createListeners(client, dispatch)
  }

  resume(client, dispatch) {
    this.watchForPeers(client, dispatch)
    this.createListeners(client, dispatch)
    this.onConnect(client, dispatch)
  }

  stop(client) {
    client.stop()
    clearInterval(this.peerCountInterval)
    this.unsubscribeSyncingSubscription(this.syncingSubscriptionId)
    this.unsubscribeNewHeadsSubscription(this.newHeadsSubscriptionId)
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
    client.on('connected', () => this.onConnect(client, dispatch))
    client.on('stopping', () =>
      dispatch(onConnectionUpdate(client.name, 'STOPPING'))
    )
    client.on('stopped', () =>
      dispatch(onConnectionUpdate(client.name, 'STOPPED'))
    )
    client.on('disconnect', () =>
      dispatch(onConnectionUpdate(client.name, 'DISCONNETED'))
    )
    client.on('error', e => dispatch(clientError(client.name, e)))
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

  onConnect(client, dispatch) {
    dispatch(onConnectionUpdate(client.name, 'CONNECTED'))

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

  async startNewHeadsSubscription(client, dispatch) {
    // TODO - why arent subscriptions coming through?
    client.rpc('eth_subscribe', ['newHeads']).then(subscriptionId => {
      this.newHeadsSubscriptionId = subscriptionId
      client.on(subscriptionId, result =>
        this.onNewHeadsSubscriptionResult(client, result, dispatch)
      )
    })
  }

  async startSyncingSubscription(client, dispatch) {
    const subscriptionId = await client.rpc('eth_subscribe', ['syncing'])
    this.syncingSubscriptionId = subscriptionId
    client.on(subscriptionId, result =>
      this.onSyncingSubscriptionResult(client, result, dispatch)
    )
  }
}

export default new ClientService()
