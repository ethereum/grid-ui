import { BigNumber } from 'bignumber.js'
import {
  newBlock,
  updateSyncing,
  updatePeerCount,
  updatePeerCountError
} from './actions'

// Utils
const isHex = str => typeof str === 'string' && str.startsWith('0x')
const hexToNumberString = str => new BigNumber(str).toString(10)
const toNumberString = str => (isHex(str) ? hexToNumberString(str) : str)

class ClientService {
  watchForPeers(plugin, dispatch) {
    this.peerCountInterval = setInterval(
      () => this.updatePeerCount(plugin, dispatch),
      3000
    )
  }

  async updatePeerCount(plugin, dispatch) {
    const hexPeerCount = await plugin.rpc('net_peerCount')
    if (hexPeerCount.message) {
      dispatch(updatePeerCountError(plugin.name, hexPeerCount.message))
    } else {
      const peerCount = toNumberString(hexPeerCount)
      dispatch(updatePeerCount(plugin.name, peerCount))
    }
  }

  clearPeerCountInterval() {
    clearInterval(this.peerCountInterval)
  }

  onNewHeadsSubscriptionResult(plugin, result, dispatch) {
    const { result: subscriptionResult } = result
    if (!subscriptionResult) return

    const {
      number: hexBlockNumber,
      timestamp: hexTimestamp
    } = subscriptionResult
    const blockNumber = Number(toNumberString(hexBlockNumber))
    const timestamp = Number(toNumberString(hexTimestamp))
    dispatch(newBlock(plugin.name, blockNumber, timestamp))
  }

  onSyncingSubscriptionResult(plugin, result, dispatch) {
    if (result === false) {
      // Stopped syncing, begin newHeads subscription
      this.startNewHeadsSubscription(plugin, dispatch)
      // Unsubscribe from syncing subscription
      this.unsubscribeSyncingSubscription(plugin)
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
      updateSyncing(plugin.name, {
        startingBlock,
        currentBlock,
        highestBlock,
        knownStates,
        pulledStates
      })
    )
  }

  unsubscribeNewHeadsSubscription(plugin) {
    if (!this.newHeadsSubscriptionId) return
    plugin.rpc('eth_unsubscribe', [this.newHeadsSubscriptionId])
    plugin.removeListener(
      this.newHeadsSubscriptionId,
      this.onNewHeadsSubscriptionResult
    )
    this.newHeadsSubscriptionId = null
  }

  unsubscribeSyncingSubscription(plugin) {
    if (!this.syncingSubscriptionId) return
    plugin.rpc('eth_unsubscribe', [this.syncingSubscriptionId])
    plugin.removeListener(
      this.syncingSubscriptionId,
      this.onSyncingSubscriptionResult
    )
    this.syncingSubscriptionId = null
  }

  startBlockSubscriptions(plugin, dispatch) {
    const startSubscriptions = async () => {
      const result = await plugin.rpc('eth_syncing')
      if (result === false) {
        // Not syncing, start newHeads subscription
        this.startNewHeadsSubscription(plugin, dispatch)
      } else {
        // Subscribe to syncing
        this.startSyncingSubscription(plugin, dispatch)
      }
    }

    const setLastBlock = () => {
      plugin.rpc('eth_getBlockByNumber', ['latest', false]).then(block => {
        const { number: hexBlockNumber, timestamp: hexTimestamp } = block
        const blockNumber = Number(toNumberString(hexBlockNumber))
        const timestamp = Number(toNumberString(hexTimestamp))
        dispatch(newBlock(plugin.name, blockNumber, timestamp))
      })
    }

    setTimeout(() => {
      setLastBlock()
      startSubscriptions()
    }, 2000)
  }

  async startNewHeadsSubscription(plugin, dispatch) {
    plugin.rpc('eth_subscribe', ['newHeads']).then(subscriptionId => {
      this.newHeadsSubscriptionId = subscriptionId
      plugin.on('notification', result => {
        const { subscription } = result
        if (subscription === this.newHeadsSubscriptionId) {
          this.onNewHeadsSubscriptionResult(plugin, result, dispatch)
        }
      })
    })
  }

  async startSyncingSubscription(plugin, dispatch) {
    console.log('∆∆∆ startSyncingSubscription')
    const subscriptionId = await plugin.rpc('eth_subscribe', ['syncing'])
    this.syncingSubscriptionId = subscriptionId
    plugin.on('notification', result => {
      const { subscription } = result
      if (subscription === this.newHeadsSubscriptionId) {
        console.log('∆∆∆ subscriptionId syncing', subscriptionId, result)
        this.onSyncingSubscriptionResult(plugin, result, dispatch)
      }
    })
  }
}

export default new ClientService()
