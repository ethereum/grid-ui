export const initialState = {
  blockNumber: null,
  changingNetwork: false,
  name: '',
  displayName: '',
  binaryName: '',
  repository: '',
  prefix: '',
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
    signature: null,
    remote: false
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
    case 'CLIENT:SELECT': {
      const { clientData } = action.payload
      return { ...state, ...clientData, release: { ...initialState.release } }
    }
    case 'CLIENT:SET_RELEASE': {
      const { release } = action.payload
      return { ...state, release }
    }
    case '[CLIENT]:GETH:INIT': {
      const { status } = action.payload
      return { ...state, state: status }
    }
    case '[CLIENT]:GETH:SET_CONFIG': {
      const { config } = action.payload
      return { ...state, config }
    }
    case '[CLIENT]:GETH:STARTED': {
      return { ...state, state: 'STARTED' }
    }
    case '[CLIENT]:GETH:STARTING': {
      return { ...state, state: 'STARTING' }
    }
    case '[CLIENT]:GETH:STOPPING': {
      return { ...state, state: 'STOPPING' }
    }
    case '[CLIENT]:GETH:STOPPED': {
      return { ...state, state: 'STOPPED' }
    }
    case '[CLIENT]:GETH:CONNECTED': {
      return { ...state, state: 'CONNECTED' }
    }
    case '[CLIENT]:GETH:DISCONNECTED': {
      return { ...state, state: 'STARTED' }
    }
    case '[CLIENT]:GETH:ERROR': {
      const { error } = action
      return { ...state, state: 'ERROR', error }
    }
    case '[CLIENT]:GETH:UPDATE_NEW_BLOCK': {
      const { blockNumber, timestamp } = action.payload
      return { ...state, blockNumber, timestamp }
    }
    case '[CLIENT]:GETH:UPDATE_SYNCING': {
      const {
        startingBlock,
        currentBlock,
        highestBlock,
        knownStates,
        pulledStates
      } = action.payload
      return {
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
    }
    case '[CLIENT]:GETH:UPDATE_NETWORK': {
      const { network } = action.payload
      return {
        ...state,
        config: {
          ...state.config,
          network
        }
      }
    }
    case '[CLIENT]:GETH:UPDATE_SYNC_MODE': {
      const { syncMode } = action.payload
      return {
        ...state,
        config: {
          ...state.config,
          syncMode
        }
      }
    }
    case '[CLIENT]:GETH:UPDATE_PEER_COUNT': {
      const { peerCount } = action.payload
      return { ...state, peerCount }
    }
    case '[CLIENT]:GETH:CLEAR_ERROR': {
      return { ...state, error: null }
    }
    default:
      return state
  }
}

export default client
