import { Mist, store } from '../API'
import { BigNumber } from 'bignumber.js'

const { geth } = Mist

const isHex = str => typeof str === 'string' && str.startsWith('0x')
const hexToNumberString = str => new BigNumber(str).toString(10)
const toNumberString = str => (isHex(str) ? hexToNumberString(str) : str)

export default class NodeStateManager {
  onNewHeadsSubscriptionResult(result) {
    const { result: subscriptionResult } = result
    if (!subscriptionResult) {
      return
    }
    const {
      number: hexBlockNumber,
      timestamp: hexTimestamp
    } = subscriptionResult
    const blockNumber = toNumberString(hexBlockNumber)
    const timestamp = toNumberString(hexTimestamp)
    store.dispatch({
      type: '[NODE]:LOCAL:UPDATE_NEW_BLOCK',
      payload: { blockNumber, timestamp }
    })
  }

  onSyncingSubscriptionResult(result) {
    if (result === false) {
      // Stopped syncing, begin newHeads subscription
      this.startNewHeadsSubscription()
      // Unsubscribe from syncing subscription
      this.unsubscribeSyncingSubscription(this.syncingSubscriptionId)
      return
    }
    if (result === true) {
      // waiting for syncing data
      return
    }
    const { status } = result
    const {
      StartingBlock: startingBlock,
      CurrentBlock: currentBlock,
      HighestBlock: highestBlock,
      KnownStates: knownStates,
      PulledStates: pulledStates
    } = status
    store.dispatch({
      type: '[NODE]:LOCAL:UPDATE_SYNCING',
      payload: {
        startingBlock,
        currentBlock,
        highestBlock,
        knownStates,
        pulledStates
      }
    })
  }

  unsubscribeNewHeadsSubscription(subscriptionId) {
    if (!this.newHeadsSubscriptionId) {
      return
    }
    geth.rpc('eth_unsubscribe', [this.newHeadsSubscriptionId])
    geth.removeListener(
      this.newHeadsSubscriptionId,
      this.onNewHeadsSubscriptionResult
    )
    this.newHeadsSubscriptionId = null
  }

  unsubscribeSyncingSubscription(subscriptionId) {
    if (!this.syncingSubscriptionId) {
      return
    }

    geth.rpc('eth_unsubscribe', [this.syncingSubscriptionId])
    geth.removeListener(
      this.syncingSubscriptionId,
      this.onSyncingSubscriptionResult
    )
    this.syncingSubscriptionId = null
  }

  async startNewHeadsSubscription() {
    geth.rpc('eth_subscribe', ['newHeads']).then(subscriptionId => {
      this.newHeadsSubscriptionId = subscriptionId
      geth.on(subscriptionId, this.onNewHeadsSubscriptionResult)
    })
  }

  async startSyncingSubscription() {
    const subscriptionId = await geth.rpc('eth_subscribe', ['syncing'])
    this.syncingSubscriptionId = subscriptionId
    geth.on(subscriptionId, this.onSyncingSubscriptionResult)
  }

  async updatePeerCount() {
    const connectedPeers = await geth.rpc('net_peerCount')
    store.dispatch({
      type: '[NODE]:LOCAL:UPDATE_PEER_COUNT',
      payload: { connectedPeers }
    })
  }

  async start() {
    const config = geth.getConfig()
    const { network, syncMode } = config

    // Set network
    store.dispatch({
      type: '[NODE]:LOCAL:UPDATE_NETWORK',
      payload: { network }
    })

    // Set sync mode
    store.dispatch({
      type: '[NODE]:LOCAL:UPDATE_SYNC_MODE',
      payload: { syncMode }
    })

    // Check peerCount every 3s
    this.peerCountInterval = setInterval(this.updatePeerCount, 3000)

    const result = await geth.rpc('eth_syncing')
    if (result === false) {
      // Not syncing, start newHeads subscription
      this.startNewHeadsSubscription()
    } else {
      // Subscribe to syncing
      this.startSyncingSubscription()
    }
  }

  stop() {
    clearInterval(this.peerCountInterval)
    this.unsubscribeSyncingSubscription(this.syncingSubscriptionId)
    this.unsubscribeNewHeadsSubscription(this.newHeadsSubscriptionId)
  }
}
