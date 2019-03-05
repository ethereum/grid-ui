import { Mist } from '../../API'

const { geth } = Mist

export const startGeth = ({ release, clientStateManager }) => {
  return async () => {
    await geth.start(release)
    clientStateManager.start()
  }
}

export const stopGeth = ({ clientStateManager }) => {
  return async () => {
    clientStateManager.stop()
    await geth.stop()
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

export const gethStarting = () => {
  return {
    type: '[CLIENT]:GETH:STARTING'
  }
}

export const gethStarted = () => {
  return {
    type: '[CLIENT]:GETH:STARTED'
  }
}

export const gethConnected = () => {
  return {
    type: '[CLIENT]:GETH:CONNECTED'
  }
}

export const gethDisconnected = () => {
  return {
    type: '[CLIENT]:GETH:DISCONNECTED'
  }
}

export const gethStopping = () => {
  return {
    type: '[CLIENT]:GETH:STOPPING'
  }
}

export const gethStopped = () => {
  return {
    type: '[CLIENT]:GETH:STOPPED'
  }
}

export const gethError = error => {
  return {
    type: '[CLIENT]:GETH:ERROR',
    payload: { error }
  }
}
