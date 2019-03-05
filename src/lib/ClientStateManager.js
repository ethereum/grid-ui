import { Mist } from '../API'
import { BigNumber } from 'bignumber.js'
import {
  newBlock,
  updateSyncing,
  updatePeerCount,
  updateNetwork,
  updateSyncMode,
  gethStarting,
  gethStarted,
  gethConnected,
  gethDisconnected,
  gethStopping,
  gethStopped,
  gethError
} from '../store/client/actions'

const { geth } = Mist

const isHex = str => typeof str === 'string' && str.startsWith('0x')
const hexToNumberString = str => new BigNumber(str).toString(10)
const toNumberString = str => (isHex(str) ? hexToNumberString(str) : str)

export default class ClientStateManager {
  constructor(dispatch) {
    this.dispatch = dispatch
  }

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
    newBlock({ blockNumber, timestamp })
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
    updateSyncing({
      startingBlock,
      currentBlock,
      highestBlock,
      knownStates,
      pulledStates
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

  onStarting() {
    console.log('1')
    this.dispatch(gethStarting())
  }

  onStarted() {
    console.log('2')
    this.dispatch(gethStarted())
  }

  onConnect() {
    console.log('3')
    this.dispatch(gethConnected())
  }

  onDisconnect() {
    console.log('4')
    this.dispatch(gethDisconnected())
  }

  onStopping() {
    console.log('4')
    this.dispatch(gethStopping())
  }

  onStopped() {
    this.dispatch(gethStopped())
  }

  onError(error) {
    this.dispatch(gethError({ error }))
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
    const peerCount = await geth.rpc('net_peerCount')
    this.dispatch(updatePeerCount({ peerCount }))
  }

  async start() {
    const config = geth.getConfig()
    const { network, syncMode } = config

    // Set network
    this.dispatch(updateNetwork({ network }))

    // Set sync mode
    this.dispatch(updateSyncMode({ syncMode }))

    // Check peerCount every 3s
    this.peerCountInterval = setInterval(this.updatePeerCount.bind(this), 3000)

    const result = await geth.rpc('eth_syncing')
    if (result === false) {
      // Not syncing, start newHeads subscription
      this.startNewHeadsSubscription()
    } else {
      // Subscribe to syncing
      this.startSyncingSubscription()
    }

    geth.on('starting', this.onStarting.bind(this))
    geth.on('started', this.onStarted.bind(this))
    geth.on('connect', this.onConnect.bind(this))
    geth.on('stopping', this.onStopping.bind(this))
    geth.on('stopped', this.onStopped.bind(this))
    geth.on('disconnect', this.onDisconnect.bind(this))
    geth.on('error', this.onError.bind(this))
  }

  stop() {
    clearInterval(this.peerCountInterval)
    this.unsubscribeSyncingSubscription(this.syncingSubscriptionId)
    this.unsubscribeNewHeadsSubscription(this.newHeadsSubscriptionId)
    geth.removeListener('starting', this.onStarting)
    geth.removeListener('started', this.onStarted)
    geth.removeListener('connect', this.onConnect)
    geth.removeListener('stopping', this.onStopping)
    geth.removeListener('stopped', this.onStopped)
    geth.removeListener('disconnect', this.onDisconnect)
    geth.removeListener('error', this.onError)
  }
}
