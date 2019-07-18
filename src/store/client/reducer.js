export const initialState = {
  selected: 'geth',
  selectedTab: 0
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
  flags: [],
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
      const { clientName, clientData, config, type, flags } = action.payload
      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...clientData,
          config,
          type,
          flags
        }
      }
    }
    case 'CLIENT:SELECT': {
      const { clientName, tab } = action.payload
      return { ...state, selected: clientName, selectedTab: tab }
    }
    case 'CLIENT:SELECT_TAB': {
      const { tab } = action.payload
      return { ...state, selectedTab: tab }
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
    case 'CLIENT:SET_FLAGS': {
      const { clientName, flags } = action.payload
      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          flags
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
          active: { ...activeState, version },
          error: null
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
    case 'CLIENT:ERROR': {
      const { payload, error } = action
      const { clientName } = payload
      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          error,
          active: { ...initialClientState.active, status: 'ERROR' }
        }
      }
    }
    case 'CLIENT:CLEAR_ERROR': {
      const { clientName } = action.payload
      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          error: null
        }
      }
    }
    case 'CLIENT:UPDATE_NEW_BLOCK': {
      const { clientName, blockNumber, timestamp } = action.payload
      const activeState = state[clientName]
        ? state[clientName].active
        : initialClientState.active

      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          active: { ...activeState, blockNumber, timestamp }
        }
      }
    }
    case 'CLIENT:UPDATE_SYNCING': {
      const {
        clientName,
        startingBlock,
        currentBlock,
        highestBlock,
        knownStates,
        pulledStates
      } = action.payload
      const activeState = state[clientName]
        ? state[clientName].active
        : initialClientState.active

      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          active: {
            ...activeState,
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
      }
    }
    case 'CLIENT:UPDATE_PEER_COUNT': {
      const { clientName, peerCount } = action.payload
      const activeState = state[clientName]
        ? state[clientName].active
        : initialClientState.active

      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          active: { ...activeState, peerCount }
        }
      }
    }
    default:
      return state
  }
}

export default client
