import { BigNumber } from 'bignumber.js'
import {
  newBlock,
  updateSyncing,
  updatePeerCount,
  updatePeerCountError,
  clearSyncing
} from './actions'

// Utils
const isHex = str => typeof str === 'string' && str.startsWith('0x')
const hexToNumberString = str => new BigNumber(str).toString(10)
const toNumberString = str => (isHex(str) ? hexToNumberString(str) : str)
const hexToNumber = str => Number(hexToNumberString(str))

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
      const peerCount = hexToNumber(hexPeerCount)
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

  onSyncingResult(plugin, result, dispatch) {
    if (result === false) {
      // Stopped syncing, begin newHeads subscription
      this.startNewHeadsSubscription(plugin, dispatch)
      // Clear syncing interval
      this.clearSyncingInterval()
      return
    }

    // TODO: client is otherwise not correctly removing interval
    if (result.startingBlock === undefined) {
      this.clearSyncingInterval()
    }

    // Waiting for syncing data
    if (result === true) return

    const {
      startingBlock,
      currentBlock,
      highestBlock,
      knownStates,
      pulledStates
    } = result

    dispatch(
      updateSyncing(plugin.name, {
        startingBlock: hexToNumber(startingBlock),
        currentBlock: hexToNumber(currentBlock),
        highestBlock: hexToNumber(highestBlock),
        knownStates: hexToNumber(knownStates),
        pulledStates: hexToNumber(pulledStates)
      })
    )
  }

  unsubscribeNewHeadsSubscription(plugin) {
    if (!this.newHeadsSubscriptionId) return
    plugin.rpc('eth_unsubscribe', [this.newHeadsSubscriptionId])
    this.newHeadsSubscriptionId = null
  }

  clearSyncingInterval() {
    clearInterval(this.syncingInterval)
  }

  startBlockSubscriptions(plugin, dispatch) {
    const startSubscriptions = async () => {
      const result = await plugin.rpc('eth_syncing')
      if (result) {
        // Subscribe to syncing
        this.startSyncingInterval(plugin, dispatch)
      } else {
        // Not syncing, start newHeads subscription
        this.startNewHeadsSubscription(plugin, dispatch)
      }
    }

    const setLastBlock = () => {
      plugin.rpc('eth_getBlockByNumber', ['latest', false]).then(block => {
        const { number: hexBlockNumber, timestamp: hexTimestamp } = block
        const blockNumber = hexToNumber(hexBlockNumber)
        const timestamp = hexToNumber(hexTimestamp)
        dispatch(newBlock(plugin.name, blockNumber, timestamp))
      })
    }

    const start = async () => {
      // Start if we have peers
      const hexPeerCount = await plugin.rpc('net_peerCount')
      if (!hexPeerCount.message && hexToNumber(hexPeerCount) > 0) {
        // Wait 5s before starting to give time for syncing status to update
        setTimeout(() => {
          setLastBlock()
          startSubscriptions()
        }, 5000)
      } else {
        // Otherwise, try again in 3s
        setTimeout(() => {
          start()
        }, 3000)
      }
    }

    start()
  }

  async startNewHeadsSubscription(plugin, dispatch) {
    // Clear any stale syncing data
    dispatch(clearSyncing(plugin.name))

    // Subscribe
    const subscriptionId = await plugin.rpc('eth_subscribe', ['newHeads'])
    this.newHeadsSubscriptionId = subscriptionId
    plugin.on('notification', result => {
      const { subscription } = result
      if (subscription === this.newHeadsSubscriptionId) {
        this.onNewHeadsSubscriptionResult(plugin, result, dispatch)
      }
    })
  }

  async startSyncingInterval(plugin, dispatch) {
    // Parity doesn't support eth_subscribe('syncing') yet and
    // geth wasn't returning results reliably, so for now we will poll.
    this.syncingInterval = setInterval(async () => {
      const result = await plugin.rpc('eth_syncing')
      this.onSyncingResult(plugin, result, dispatch)
    }, 3000)
  }
}

export default new ClientService()
