import { Mist } from '../../API'

const { geth } = Mist

export const startGeth = ({ release, clientStateManager }) => {
  return async dispatch => {
    dispatch({ type: '[CLIENT]:GETH:STARTING' })
    await geth.start(release)
    dispatch({ type: '[CLIENT]:GETH:STARTED' })
    clientStateManager.start()
  }
}

export const stopGeth = ({ clientStateManager }) => {
  return async dispatch => {
    clientStateManager.stop()
    dispatch({ type: '[CLIENT]:GETH:STOPPING' })
    geth.stop()
    dispatch({ type: '[CLIENT]:GETH:STOPPED' })
  }
}

export const newBlock = ({ blockNumber, timestamp }) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_NEW_BLOCK',
    payload: { blockNumber, timestamp }
  }
}

export const updateSyncing = ({
  startingBlock,
  currentBlock,
  highestBlock,
  knownStates,
  pulledStates
}) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_SYNCING',
    payload: {
      startingBlock,
      currentBlock,
      highestBlock,
      knownStates,
      pulledStates
    }
  }
}

export const updatePeerCount = ({ peerCount }) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_PEER_COUNT',
    payload: { peerCount }
  }
}

export const updateNetwork = ({ network }) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_NETWORK',
    payload: { network }
  }
}

export const updateSyncMode = ({ syncMode }) => {
  return {
    type: '[CLIENT]:GETH:UPDATE_SYNC_MODE',
    payload: { syncMode }
  }
}
