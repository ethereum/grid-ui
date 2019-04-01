export const initialState = {
  blockNumber: null,
  changingNetwork: false,
  name: 'geth',
  peerCount: 0,
  state: 'STOPPED',
  sync: {
    currentBlock: 0,
    highestBlock: 0,
    knownStates: 0,
    pulledStates: 0,
    startingBlock: 0
  },
  timestamp: null,
  error: null,
  release: {
    name: null,
    fileName: null,
    version: null,
    tag: null,
    size: null,
    location: null,
    checksums: null,
    signature: null
  },
  config: {
    name: null,
    dataDir: null,
    host: null,
    port: null,
    network: null,
    syncMode: null,
    ipc: null
  }
}

const client = (state = initialState, action) => {
  switch (action.type) {
    case '[CLIENT]:GETH:INIT': {
      const { status } = action.payload
      return { ...state, state: status }
    }
    case '[CLIENT]:GETH:SET_CONFIG': {
      const { config } = action.payload
      const newState = {
        ...state,
        config
      }
      return newState
    }
    case '[CLIENT]:GETH:STARTED': {
      const newState = {
        ...state,
        state: 'STARTED'
      }
      return newState
    }
    case '[CLIENT]:GETH:STARTING': {
      const newState = {
        ...state,
        state: 'STARTING'
      }
      return newState
    }
    case '[CLIENT]:GETH:STOPPING': {
      const newState = {
        ...state,
        state: 'STOPPING'
      }
      return newState
    }
    case '[CLIENT]:GETH:STOPPED': {
      const newState = {
        ...state,
        state: 'STOPPED'
      }
      return newState
    }
    case '[CLIENT]:GETH:CONNECTED': {
      const newState = {
        ...state,
        state: 'CONNECTED'
      }
      return newState
    }
    case '[CLIENT]:GETH:DISCONNECTED': {
      const newState = {
        ...state,
        state: 'STARTED'
      }
      return newState
    }
    case '[CLIENT]:GETH:ERROR': {
      const { error } = action.payload
      const newState = {
        ...state,
        state: 'ERROR',
        error
      }
      return newState
    }
    case '[CLIENT]:GETH:RESTART:BEGIN': {
      const newState = {
        ...state,
        process: {
          ...state.process,
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
          state: 'STARTED'
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:SET_RELEASE': {
      const { release } = action.payload
      const newState = {
        ...state,
        release
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
        config: {
          ...state.config,
          network
        }
      }
      return newState
    }
    case '[CLIENT]:GETH:UPDATE_SYNC_MODE': {
      const { syncMode } = action.payload
      const newState = {
        ...state,
        config: {
          ...state.config,
          syncMode
        }
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
    case '[CLIENT]:GETH:CLEAR_ERROR': {
      const newState = {
        ...state,
        error: null
      }
      return newState
    }
    default:
      return state
  }
}

export default client
