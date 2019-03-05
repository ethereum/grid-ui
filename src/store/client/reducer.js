export const initialState = {
  blockNumber: 0,
  changingNetwork: false,
  isRunning: false,
  name: 'geth',
  network: 'main',
  peerCount: 0,
  state: 'STOPPED',
  sync: {
    currentBlock: 0,
    highestBlock: 0,
    knownStates: 0,
    pulledStates: 0,
    startingBlock: 0
  },
  syncMode: 'light',
  timestamp: 0
}

const client = (state = initialState, action) => {
  switch (action.type) {
    case '[CLIENT]:GETH:STARTED': {
      const newState = {
        ...state,
        isRunning: true,
        state: 'STARTED'
      }
      return newState
    }
    case '[CLIENT]:GETH:STARTING': {
      const newState = {
        ...state,
        isRunning: true,
        state: 'STARTING'
      }
      return newState
    }
    case '[CLIENT]:GETH:STOPPING': {
      const newState = {
        ...state,
        isRunning: false,
        state: 'STOPPING'
      }
      return newState
    }
    case '[CLIENT]:GETH:STOPPED': {
      const newState = {
        ...state,
        isRunning: false,
        state: 'STOPPED'
      }
      return newState
    }
    case '[CLIENT]:GETH:RESTART:BEGIN': {
      const newState = {
        ...state,
        process: {
          ...state.process,
          isRunning: false,
          state: 'STOPPING'
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:RESTART:END': {
      const newState = {
        ...state,
        process: {
          ...state.process,
          isRunning: true,
          state: 'STARTED'
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:NEW_STATE': {
      const { state: clientState } = action.payload
      const newState = {
        ...state,
        process: {
          ...state.process,
          state: clientState
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:IPC_CONNECTED': {
      const newState = {
        ...state,
        process: {
          ...state.process,
          ipcConnected: true
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:IPC_DISCONNECTED': {
      const newState = {
        ...state,
        process: {
          ...state.process,
          ipcConnected: false
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:UPDATE_NEW_BLOCK': {
      const { blockNumber, timestamp } = action.payload
      const newState = {
        ...state,
        blockNumber,
        timestamp
      }
      return newState
    }
    case '[CLIENT]:GETH:UPDATE_SYNCING': {
      const {
        startingBlock,
        currentBlock,
        highestBlock,
        knownStates,
        pulledStates
      } = action.payload
      const newState = {
        ...state,
        sync: {
          ...state.sync,
          startingBlock,
          currentBlock,
          highestBlock,
          knownStates,
          pulledStates
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:UPDATE_NETWORK': {
      const { network } = action.payload
      const newState = {
        ...state,
        network
      }
      return newState
    }
    case '[CLIENT]:GETH:UPDATE_SYNC_MODE': {
      const { syncMode } = action.payload
      const newState = {
        ...state,
        syncMode
      }
      return newState
    }
    case '[CLIENT]:GETH:UPDATE_PEER_COUNT': {
      const { peerCount } = action.payload
      const newState = {
        ...state,
        peerCount
      }
      return newState
    }
    default:
      return state
  }
}

export default client
