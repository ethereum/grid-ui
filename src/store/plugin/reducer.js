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
  errors: [],
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

const plugin = (state = initialState, action) => {
  switch (action.type) {
    case 'PLUGIN:INIT': {
      const {
        clientName,
        clientData,
        config,
        type,
        flags,
        release
      } = action.payload
      const newState = {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...clientData,
          config,
          type,
          flags
        }
      }
      if (release) {
        newState[clientName].release = release
      }
      return newState
    }
    case 'PLUGIN:SELECT': {
      const { clientName, tab } = action.payload
      return { ...state, selected: clientName, selectedTab: tab }
    }
    case 'PLUGIN:SELECT_TAB': {
      const { tab } = action.payload
      return { ...state, selectedTab: tab }
    }
    case 'PLUGIN:SET_RELEASE': {
      const { clientName, release } = action.payload
      return {
        ...state,
        [clientName]: { ...initialClientState, ...state[clientName], release }
      }
    }
    case 'PLUGIN:SET_CONFIG': {
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
    case 'PLUGIN:SET_FLAGS': {
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
    case 'PLUGIN:START': {
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
          errors: []
        }
      }
    }
    case 'PLUGIN:STATUS_UPDATE': {
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
    case 'PLUGIN:STOP': {
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
    case 'PLUGIN:ERROR:ADD': {
      const { payload, error } = action
      const { clientName } = payload
      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          errors: [...state[clientName].errors, error]
        }
      }
    }
    case 'PLUGIN:CLEAR_ERROR': {
      const { clientName, index } = action.payload

      return {
        ...state,
        [clientName]: {
          ...initialClientState,
          ...state[clientName],
          errors: state[clientName].errors.filter(
            (n, nIndex) => nIndex !== index
          )
        }
      }
    }
    case 'PLUGIN:UPDATE_NEW_BLOCK': {
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
    case 'PLUGIN:UPDATE_SYNCING': {
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
    case 'PLUGIN:UPDATE_PEER_COUNT': {
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

export default plugin
