export const initialState = {
  accounts: [],
  activeAccount: null,
  error: null,
  state: 'STOPPED',
  requests: [],
  selectedRequest: null,
  config: {
    name: null,
    keystoreDir: null,
    rpcHost: null,
    rpcPort: null
  },
  notifications: []
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
    case '[SIGNER]:CLEF:ADD_REQUEST': {
      const { request } = action.payload
      const requests = [...state.requests, request]
      const newState = {
        ...state,
        requests
      }
      return newState
    }
    case '[SIGNER]:CLEF:SELECT_REQUEST': {
      const { index } = action.payload
      const newState = {
        ...state,
        selectedRequest: index
      }
      return newState
    }
    case '[SIGNER]:CLEF:REQUEST_DONE': {
      const { id, nextSelected } = action.payload
      const newState = {
        ...state,
        selectedRequest: nextSelected,
        requests: state.requests.filter(request => request.id !== id)
      }
      return newState
    }
    case '[SIGNER]:CLEF:ADD_NOTIFICATION': {
      const { type, text } = action.payload
      const notification = { type, text }
      const notifications = [...state.notifications, notification]
      const newState = {
        ...state,
        notifications
      }
      return newState
    }
    case '[SIGNER]:CLEF:CLEAR_NOTIFICATION': {
      const { index } = action.payload
      const newState = {
        ...state,
        notifications: state.notifications.filter(
          (n, nIndex) => nIndex !== index
        )
      }
      return newState
    }
    default:
      return state
  }
}

export default signer
