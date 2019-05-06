export const initialState = {
  selected: 'geth'
  // Clients dynamically populate within this object, e.g.
  // geth: { config: {}, release: {}, ... },
  // parity: { config: {}, release: {}, ... },
}

export const initialClientState = {
  active: {
    blockNumber: null,
    peerCount: 0,
    status: 'STOPPED',
    sync: {
      currentBlock: 0,
      highestBlock: 0,
      knownStates: 0,
      pulledStates: 0,
      startingBlock: 0
    },
    timestamp: null,
    version: null
  },
  binaryName: '',
  config: {},
  displayName: '',
  error: null,
  name: '',
  prefix: '',
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
  repository: '',
  type: ''
}

const client = (state = initialState, action) => {
  switch (action.type) {
    case 'CLIENT:INIT': {
      const { clientName, clientData, config, type } = action.payload
      return {
        ...state,
        [clientName]: { ...initialClientState, ...clientData, config, type }
      }
    }
    case 'CLIENT:SELECT': {
      const { clientName } = action.payload
      return { ...state, selected: clientName }
    }
    case 'CLIENT:SET_RELEASE': {
      const { clientName, release } = action.payload
      return {
        ...state,
        [clientName]: { ...initialClientState, ...state[clientName], release }
      }
    }
    case 'CLIENT:SET_CONFIG': {
      const { clientName, config } = action.payload
      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          config
        }
      }
    }
    case 'CLIENT:START': {
      const { clientName, version } = action.payload
      const activeState = state[clientName]
        ? state[clientName].active
        : initialClientState.active

      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          active: { ...activeState, version }
        }
      }
    }
    case 'CLIENT:STATUS_UPDATE': {
      const { clientName, status } = action.payload
      const activeState = state[clientName]
        ? state[clientName].active
        : initialClientState.active

      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          active: { ...activeState, status }
        }
      }
    }
    case 'CLIENT:STOP': {
      const { clientName } = action.payload
      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          active: { ...initialClientState.active }
        }
      }
    }
    case '[CLIENT]:GETH:INIT': {
      const { status } = action.payload
      return { ...state, state: status }
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
