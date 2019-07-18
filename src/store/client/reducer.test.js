import reducer, { initialState, initialClientState } from './reducer'

describe('the client reducer', () => {
  it('should handle CLIENT:INIT', () => {
    const action = {
      type: 'CLIENT:INIT',
      payload: {
        clientName: 'parity',
        clientData: {
          name: 'parity',
          displayName: 'Parity',
          config: { default: { sync: 'warp' } }
        },
        config: { sync: 'warp' },
        flags: [],
        type: 'client'
      }
    }
    const expectedState = {
      ...initialState,
      parity: {
        ...initialClientState,
        name: 'parity',
        displayName: 'Parity',
        config: { sync: 'warp' },
        flags: [],
        type: 'client'
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:SELECT', () => {
    const action = {
      type: 'CLIENT:SELECT',
      payload: { clientName: 'parity', tab: 0 }
    }
    const expectedState = { ...initialState, selected: 'parity' }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:SELECT_TAB', () => {
    const action = {
      type: 'CLIENT:SELECT_TAB',
      payload: { tab: 2 }
    }
    const expectedState = { ...initialState, selectedTab: 2 }

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
      payload: { clientName: 'geth', config }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState, config }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:START', () => {
    const action = {
      type: 'CLIENT:START',
      payload: {
        clientName: 'geth',
        version: '1.X.X'
      }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialClientState,
        active: { ...initialClientState.active, version: '1.X.X' }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:STATUS_UPDATE', () => {
    const action = {
      type: 'CLIENT:STATUS_UPDATE',
      payload: {
        clientName: 'geth',
        status: 'STARTED'
      }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialClientState,
        active: { ...initialClientState.active, status: 'STARTED' }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:STOP', () => {
    const action = {
      type: 'CLIENT:STOP',
      payload: { clientName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:ERROR', () => {
    const action = {
      type: 'CLIENT:ERROR',
      error: 'Boom',
      payload: { clientName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialClientState,
        error: 'Boom',
        active: { ...initialClientState.active, status: 'ERROR' }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:CLEAR_ERROR', () => {
    const action = {
      type: 'CLIENT:CLEAR_ERROR',
      payload: { clientName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState, error: null }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:UPDATE_PEER_COUNT', () => {
    const action = {
      type: 'CLIENT:UPDATE_PEER_COUNT',
      payload: { clientName: 'geth', peerCount: '3' }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialClientState,
        active: { ...initialClientState.active, peerCount: '3' }
      }
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
      payload: { clientName: 'geth', release }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState, release }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:UPDATE_NEW_BLOCK', () => {
    const blockNumber = '123123'
    const timestamp = '321321321'
    const action = {
      type: 'CLIENT:UPDATE_NEW_BLOCK',
      payload: { clientName: 'geth', blockNumber, timestamp }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialClientState,
        active: { ...initialClientState.active, blockNumber, timestamp }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLIENT:UPDATE_SYNCING', () => {
    const sync = {
      currentBlock: 123,
      highestBlock: 124,
      knownStates: 125,
      pulledStates: 124,
      startingBlock: 0
    }
    const action = {
      type: 'CLIENT:UPDATE_SYNCING',
      payload: { clientName: 'geth', ...sync }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialClientState,
        active: { ...initialClientState.active, sync }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
