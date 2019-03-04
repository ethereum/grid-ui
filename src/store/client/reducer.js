export const initialState = {
  blockNumber: 0,
  changingNetwork: false,
  name: 'geth',
  network: 'main',
  peerCount: 0,
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
    default:
      return state
  }
}

export default client
