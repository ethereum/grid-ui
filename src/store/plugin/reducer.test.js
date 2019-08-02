import reducer, { initialState, initialClientState } from './reducer'

describe('the client reducer', () => {
  it('should handle PLUGIN:INIT', () => {
    const action = {
      type: 'PLUGIN:INIT',
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

  it('should handle PLUGIN:SELECT', () => {
    const action = {
      type: 'PLUGIN:SELECT',
      payload: { clientName: 'parity', tab: 0 }
    }
    const expectedState = { ...initialState, selected: 'parity' }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:SELECT_TAB', () => {
    const action = {
      type: 'PLUGIN:SELECT_TAB',
      payload: { tab: 2 }
    }
    const expectedState = { ...initialState, selectedTab: 2 }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:SET_CONFIG', () => {
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
      type: 'PLUGIN:SET_CONFIG',
      payload: { clientName: 'geth', config }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState, config }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:START', () => {
    const action = {
      type: 'PLUGIN:START',
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

  it('should handle PLUGIN:STATUS_UPDATE', () => {
    const action = {
      type: 'PLUGIN:STATUS_UPDATE',
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

  it('should handle PLUGIN:STOP', () => {
    const action = {
      type: 'PLUGIN:STOP',
      payload: { clientName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:ERROR:ADD', () => {
    const action = {
      type: 'PLUGIN:ERROR:ADD',
      error: 'Boom',
      payload: { clientName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialClientState,
        errors: ['Boom']
      }
    }

    expect(
      reducer({ ...initialState, geth: initialClientState }, action)
    ).toEqual(expectedState)
  })

  it('should handle PLUGIN:CLEAR_ERROR', () => {
    const action = {
      type: 'PLUGIN:CLEAR_ERROR',
      payload: { clientName: 'geth', index: 0 }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState, errors: [] }
    }

    expect(
      reducer({ ...initialState, geth: initialClientState }, action)
    ).toEqual(expectedState)
  })

  it('should handle PLUGIN:UPDATE_PEER_COUNT', () => {
    const action = {
      type: 'PLUGIN:UPDATE_PEER_COUNT',
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

  it('should handle PLUGIN:SET_RELEASE', () => {
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
      type: 'PLUGIN:SET_RELEASE',
      payload: { clientName: 'geth', release }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialClientState, release }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:UPDATE_NEW_BLOCK', () => {
    const blockNumber = '123123'
    const timestamp = '321321321'
    const action = {
      type: 'PLUGIN:UPDATE_NEW_BLOCK',
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

  it('should handle PLUGIN:UPDATE_SYNCING', () => {
    const sync = {
      currentBlock: 123,
      highestBlock: 124,
      knownStates: 125,
      pulledStates: 124,
      startingBlock: 0
    }
    const action = {
      type: 'PLUGIN:UPDATE_SYNCING',
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
