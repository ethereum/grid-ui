export const initialState = {
  accounts: [],
  activeAccount: null,
  error: null,
  state: 'STOPPED',
  config: {
    name: null,
    keystoreDir: null,
    rpcHost: null,
    rpcPort: null
  }
}

const signer = (state = initialState, action) => {
  switch (action.type) {
    case '[SIGNER]:CLEF:STARTING': {
      const newState = {
        ...state,
        state: 'STARTING'
      }
      return newState
    }
    case '[SIGNER]:CLEF:STARTED': {
      const newState = {
        ...state,
        state: 'STARTED'
      }
      return newState
    }
    case '[SIGNER]:CLEF:STOPPING': {
      const newState = {
        ...state,
        state: 'STOPPING'
      }
      return newState
    }
    case '[SIGNER]:CLEF:STOPPED': {
      const newState = {
        ...state,
        state: 'STOPPED'
      }
      return newState
    }
    case '[SIGNER]:CLEF:CONNECTED': {
      const newState = {
        ...state,
        state: 'CONNECTED'
      }
      return newState
    }
    case '[SIGNER]:CLEF:DISCONNECTED': {
      const newState = {
        ...state,
        state: 'STARTED'
      }
      return newState
    }
    case '[SIGNER]:CLEF:ERROR': {
      const { error } = action.payload
      const newState = {
        ...state,
        state: 'ERROR',
        error
      }
      return newState
    }
    case '[SIGNER]:CLEF:CLEAR_ERROR': {
      const newState = {
        ...state,
        error: null,
        state: 'STOPPED'
      }
      return newState
    }
    case '[SIGNER]:CLEF:SET_CONFIG': {
      const { config } = action.payload
      const newState = {
        ...state,
        config
      }
      return newState
    }
    default:
      return state
  }
}

export default signer
