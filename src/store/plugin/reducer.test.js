import reducer, { initialState, initialPluginState } from './reducer'

describe('the plugin reducer', () => {
  it('should handle PLUGIN:INIT', () => {
    const action = {
      type: 'PLUGIN:INIT',
      payload: {
        pluginName: 'parity',
        pluginData: {
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
        ...initialPluginState,
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
      payload: { pluginName: 'parity', tab: 0 }
    }
    const expectedState = { ...initialState, selected: 'parity' }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:DISMISS_FLAG_WARNING', () => {
    const action = { type: 'PLUGIN:DISMISS_FLAG_WARNING' }
    const expectedState = { ...initialState, showCustomFlagWarning: false }

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
      payload: { pluginName: 'geth', config }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialPluginState, config }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:START', () => {
    const action = {
      type: 'PLUGIN:START',
      payload: {
        pluginName: 'geth',
        version: '1.X.X'
      }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        active: { ...initialPluginState.active, version: '1.X.X' }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:STATUS_UPDATE', () => {
    const action = {
      type: 'PLUGIN:STATUS_UPDATE',
      payload: {
        pluginName: 'geth',
        status: 'STARTED'
      }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        active: { ...initialPluginState.active, status: 'STARTED' }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:STOP', () => {
    const action = {
      type: 'PLUGIN:STOP',
      payload: { pluginName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialPluginState }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:ERROR:ADD', () => {
    const action = {
      type: 'PLUGIN:ERROR:ADD',
      error: 'Boom',
      payload: { pluginName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        errors: ['Boom']
      }
    }

    expect(
      reducer({ ...initialState, geth: initialPluginState }, action)
    ).toEqual(expectedState)
  })

  it('should handle PLUGIN:ERROR:CLEAR', () => {
    const action = {
      type: 'PLUGIN:ERROR:CLEAR',
      payload: { pluginName: 'geth', key: 'abc' }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        errors: [{ key: 'abcd', message: 'boom2' }]
      }
    }

    expect(
      reducer(
        {
          ...initialState,
          geth: {
            ...initialPluginState,
            errors: [
              { key: 'abc', message: 'boom' },
              { key: 'abcd', message: 'boom2' }
            ]
          }
        },
        action
      )
    ).toEqual(expectedState)
  })

  it('should handle PLUGIN:ERROR:CLEAR_ALL', () => {
    const action = {
      type: 'PLUGIN:ERROR:CLEAR_ALL',
      payload: { pluginName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialPluginState, errors: [] }
    }

    expect(
      reducer(
        {
          ...initialState,
          geth: {
            ...initialPluginState,
            errors: [
              { key: 'abc', message: 'boom' },
              { key: 'abcd', message: 'boom2' }
            ]
          }
        },
        action
      )
    ).toEqual(expectedState)
  })

  it('should handle PLUGIN:UPDATE_PEER_COUNT', () => {
    const action = {
      type: 'PLUGIN:UPDATE_PEER_COUNT',
      payload: { pluginName: 'geth', peerCount: '3' }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        active: { ...initialPluginState.active, peerCount: '3' }
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
      payload: { pluginName: 'geth', release }
    }
    const expectedState = {
      ...initialState,
      geth: { ...initialPluginState, release }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:UPDATE_NEW_BLOCK', () => {
    const blockNumber = '123123'
    const timestamp = '321321321'
    const action = {
      type: 'PLUGIN:UPDATE_NEW_BLOCK',
      payload: { pluginName: 'geth', blockNumber, timestamp }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        active: { ...initialPluginState.active, blockNumber, timestamp }
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
      payload: { pluginName: 'geth', ...sync }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        active: { ...initialPluginState.active, sync }
      }
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle PLUGIN:CLEAR_SYNCING', () => {
    const sync = {
      currentBlock: 123,
      highestBlock: 124,
      knownStates: 125,
      pulledStates: 124,
      startingBlock: 5
    }
    const action = {
      type: 'PLUGIN:CLEAR_SYNCING',
      payload: { pluginName: 'geth' }
    }
    const expectedState = {
      ...initialState,
      geth: {
        ...initialPluginState,
        active: {
          ...initialPluginState.active,
          sync: initialPluginState.active.sync
        }
      }
    }

    expect(
      reducer(
        {
          ...initialState,
          geth: {
            ...initialPluginState,
            active: { ...initialPluginState.active, sync }
          }
        },
        action
      )
    ).toEqual(expectedState)
  })
})
