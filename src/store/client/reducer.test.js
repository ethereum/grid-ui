import reducer, { initialState, initialClientState } from './reducer'

describe('the client reducer', () => {
  it('should handle CLIENT:INIT', () => {
    const action = {
      type: 'CLIENT:INIT',
      payload: {
        clientName: 'parity',
        clientData: { name: 'parity', displayName: 'Parity' }
      }
    }
    const expectedState = {
      ...initialState,
      parity: { ...initialClientState, name: 'parity', displayName: 'Parity' }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:SET_CONFIG', () => {
    const config = {
      name: 'default',
      dataDir: '/example',
      host: 'example',
      port: '1234',
      network: 'rinkeby',
      syncMode: 'light',
      ipc: 'websockets'
    }
    const action = {
      type: 'CLIENT:SET_CONFIG',
      payload: { config }
    }
    const expectedState = { ...initialState, config }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle [CLIENT]:GETH:ERROR', () => {
    const action = {
      type: '[CLIENT]:GETH:ERROR',
      error: 'Boom'
    }
    const expectedState = { ...initialState, state: 'ERROR', error: 'Boom' }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle [CLIENT]:GETH:CLEAR_ERROR', () => {
    const action = { type: '[CLIENT]:GETH:CLEAR_ERROR' }
    const expectedState = { ...initialState, error: null }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle [CLIENT]:GETH:UPDATE_PEER_COUNT', () => {
    const action = {
      type: '[CLIENT]:GETH:UPDATE_PEER_COUNT',
      payload: { peerCount: '3' }
    }
    const expectedState = { ...initialState, peerCount: '3' }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle [CLIENT]:GETH:UPDATE_NETWORK', () => {
    const action = {
      type: '[CLIENT]:GETH:UPDATE_NETWORK',
      payload: { network: 'rinkeby' }
    }
    const expectedState = {
      ...initialState,
      config: { ...initialState.config, network: 'rinkeby' }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle [CLIENT]:GETH:UPDATE_SYNC_MODE', () => {
    const action = {
      type: '[CLIENT]:GETH:UPDATE_SYNC_MODE',
      payload: { syncMode: 'light' }
    }
    const expectedState = {
      ...initialState,
      config: { ...initialState.config, syncMode: 'light' }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:SET_RELEASE', () => {
    const release = {
      name: 'example',
      fileName: 'example',
      version: '1.X.X',
      tag: 'alpha',
      size: 'example',
      location: 'example',
      checksums: 'example',
      signature: 'example'
    }
    const action = {
      type: 'CLIENT:SET_RELEASE',
      payload: { release }
    }
    const expectedState = { ...initialState, release }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle [CLIENT]:GETH:UPDATE_NEW_BLOCK', () => {
    const blockNumber = '123123'
    const timestamp = '321321321'
    const action = {
      type: '[CLIENT]:GETH:UPDATE_NEW_BLOCK',
      payload: { blockNumber, timestamp }
    }
    const expectedState = {
      ...initialState,
      blockNumber,
      timestamp
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle [CLIENT]:GETH:UPDATE_SYNCING', () => {
    const sync = {
      currentBlock: 123,
      highestBlock: 124,
      knownStates: 125,
      pulledStates: 124,
      startingBlock: 0
    }
    const action = {
      type: '[CLIENT]:GETH:UPDATE_SYNCING',
      payload: { ...sync }
    }
    const expectedState = { ...initialState, sync }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
