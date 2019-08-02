export const initialState = {
  selected: 'geth',
  selectedTab: 0
  // Plugins dynamically populate within this object, e.g.
  // geth: { config: {}, release: {}, ... },
  // parity: { config: {}, release: {}, ... },
}

export const initialPluginState = {
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
        pluginName,
        pluginData,
        config,
        type,
        flags,
        release
      } = action.payload
      const newState = {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...pluginData,
          config,
          type,
          flags
        }
      }
      if (release) {
        newState[pluginName].release = release
      }
      return newState
    }
    case 'PLUGIN:SELECT': {
      const { pluginName, tab } = action.payload
      return { ...state, selected: pluginName, selectedTab: tab }
    }
    case 'PLUGIN:SELECT_TAB': {
      const { tab } = action.payload
      return { ...state, selectedTab: tab }
    }
    case 'PLUGIN:SET_RELEASE': {
      const { pluginName, release } = action.payload
      return {
        ...state,
        [pluginName]: { ...initialPluginState, ...state[pluginName], release }
      }
    }
    case 'PLUGIN:SET_CONFIG': {
      const { pluginName, config } = action.payload
      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          config
        }
      }
    }
    case 'PLUGIN:SET_FLAGS': {
      const { pluginName, flags } = action.payload
      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          flags
        }
      }
    }
    case 'PLUGIN:START': {
      const { pluginName, version } = action.payload
      const activeState = state[pluginName]
        ? state[pluginName].active
        : initialPluginState.active

      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          active: { ...activeState, version },
          errors: []
        }
      }
    }
    case 'PLUGIN:STATUS_UPDATE': {
      const { pluginName, status } = action.payload
      const activeState = state[pluginName]
        ? state[pluginName].active
        : initialPluginState.active

      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          active: { ...activeState, status }
        }
      }
    }
    case 'PLUGIN:STOP': {
      const { pluginName } = action.payload
      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          active: { ...initialPluginState.active }
        }
      }
    }
    case 'PLUGIN:ERROR:ADD': {
      const { payload, error } = action
      const { pluginName } = payload
      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          errors: [...state[pluginName].errors, error]
        }
      }
    }
    case 'PLUGIN:CLEAR_ERROR': {
      const { pluginName, index } = action.payload

      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          errors: state[pluginName].errors.filter(
            (n, nIndex) => nIndex !== index
          )
        }
      }
    }
    case 'PLUGIN:UPDATE_NEW_BLOCK': {
      const { pluginName, blockNumber, timestamp } = action.payload
      const activeState = state[pluginName]
        ? state[pluginName].active
        : initialPluginState.active

      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          active: { ...activeState, blockNumber, timestamp }
        }
      }
    }
    case 'PLUGIN:UPDATE_SYNCING': {
      const {
        pluginName,
        startingBlock,
        currentBlock,
        highestBlock,
        knownStates,
        pulledStates
      } = action.payload
      const activeState = state[pluginName]
        ? state[pluginName].active
        : initialPluginState.active

      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
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
      const { pluginName, peerCount } = action.payload
      const activeState = state[pluginName]
        ? state[pluginName].active
        : initialPluginState.active

      return {
        ...state,
        [pluginName]: {
          ...initialPluginState,
          ...state[pluginName],
          active: { ...activeState, peerCount }
        }
      }
    }
    default:
      return state
  }
}

export default plugin
