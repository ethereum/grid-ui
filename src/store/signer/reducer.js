export const initialState = {
  accounts: [],
  state: 'STOPPED'
}

const client = (state = initialState, action) => {
  switch (action.type) {
    case '[SIGNER]:CLEF:START': {
      const newState = {
        ...state,
        state: 'STARTING'
      }
      return newState
    }
    case '[SIGNER]:CLEF:STOP': {
      const newState = {
        ...state,
        state: 'STOPPING'
      }
      return newState
    }
    default:
      return state
  }
}

export default client
