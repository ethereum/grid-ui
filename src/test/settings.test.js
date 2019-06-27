import {
  getDefaultSetting,
  getPluginSettingsConfig,
  getSettingsIds
} from '../lib/utils'
import { generateFlags } from '../lib/flags'

describe('getPluginSettingsConfig', () => {
  it('returns an empty array if no client', () => {
    const client = undefined
    expect(getPluginSettingsConfig(client)).toEqual([])
  })

  it('returns an empty array if no settings config', () => {
    const client = { plugin: { config: {} } }
    expect(getPluginSettingsConfig(client)).toEqual([])
  })

  it('returns an empty array if settings are not an array', () => {
    const client = { plugin: { config: { settings: { one: '1', two: '2' } } } }
    expect(getPluginSettingsConfig(client)).toEqual([])
  })

  it('returns the array of settings', () => {
    const settings = [{ id: 'one' }, { id: 'two' }]
    const client = { plugin: { config: { settings } } }
    expect(getPluginSettingsConfig(client)).toEqual(settings)
  })
})

describe('getDefaultSetting', () => {
  it('returns an empty string if no client', () => {
    const client = undefined
    expect(getDefaultSetting(client, 'network')).toEqual('')
  })

  it('returns an empty string if no id', () => {
    const settings = [{ id: 'one', default: 'a' }, { id: 'two', default: 'b' }]
    const client = { plugin: { config: { settings } } }
    expect(getDefaultSetting(client, undefined)).toEqual('')
  })

  it('returns the default value', () => {
    const settings = [{ id: 'one', default: 'a' }, { id: 'two', default: 'b' }]
    const client = { plugin: { config: { settings } } }
    expect(getDefaultSetting(client, 'two')).toEqual('b')
  })
})

describe('getSettingsIds', () => {
  it('returns an empty array if no client', () => {
    const client = undefined
    expect(getSettingsIds(client)).toEqual([])
  })

  it('returns an array of ids', () => {
    const settings = [{ id: 'one', default: 'a' }, { id: 'two', default: 'b' }]
    const client = { plugin: { config: { settings } } }
    expect(getSettingsIds(client)).toEqual(['one', 'two'])
  })
})

describe('generateFlags', () => {
  it('should handle an empty settings', () => {
    const input = {}
    const settings = []
    const flags = generateFlags(input, settings)

    expect(flags).toEqual([])
  })

  it('should parse basic field', () => {
    const input = { network: '' }
    const settings = [{ id: 'network', flag: '--rinkeby' }]
    const flags = generateFlags(input, settings)

    expect(flags).toEqual(['--rinkeby'])
  })

  it('should parse some basic fields', () => {
    const input = {
      network: '',
      debug: '',
      nodiscovery: ''
    }
    const settings = [
      { id: 'network', flag: '--rinkeby' },
      { id: 'debug', flag: '--debug' },
      { id: 'nodiscovery', flag: '--no-discovery' }
    ]
    const flags = generateFlags(input, settings)

    expect(flags).toContain('--rinkeby')
    expect(flags).toContain('--debug')
    expect(flags).toContain('--no-discovery')
  })

  it('should parse text values', () => {
    const input = {
      cache: '1024',
      syncmode: 'light'
    }
    const settings = [
      { id: 'cache', flag: '--cache %s' },
      { id: 'syncmode', flag: '--syncmode %s' }
    ]
    const flags = generateFlags(input, settings)

    expect(flags).toEqual(['--cache', '1024', '--syncmode', 'light'])
  })

  it('should parse simple options', () => {
    const input = {
      syncmode: 'light'
    }
    const settings = [
      {
        id: 'syncmode',
        options: ['fast', 'full', 'light'],
        flag: '--syncmode %s'
      }
    ]

    const flags = generateFlags(input, settings)
    expect(flags).toEqual(['--syncmode', 'light'])
  })

  it('should parse full options', () => {
    const input = {
      network: 'rinkeby'
    }
    const settings = [
      {
        id: 'network',
        default: 'main',
        options: [
          { value: 'ropsten', flag: '--testnet' },
          { value: 'rinkeby', flag: '--rinkeby' }
        ]
      }
    ]

    const flags = generateFlags(input, settings)
    expect(flags).toEqual(['--rinkeby'])
  })

  it('full options should allow empty flags', () => {
    const input = {
      network: 'mainnet'
    }
    const settings = [
      {
        id: 'network',
        options: [
          { value: 'ropsten', flag: '--testnet' },
          { value: 'mainnet', flag: '' }
        ]
      }
    ]

    const flags = generateFlags(input, settings)
    expect(flags).toEqual([])
  })

  it('should parse value with full options', () => {
    const input = {
      syncmode: 'light'
    }
    const settings = [
      {
        id: 'syncmode',
        options: [
          { value: 'fast', flag: '--syncmode %s' },
          { value: 'light', flag: '--syncmode %s --maxpeers=100' }
        ]
      }
    ]

    const flags = generateFlags(input, settings)
    expect(flags).toEqual(['--syncmode', 'light', '--maxpeers=100'])
  })

  it('should not split values with spaces', () => {
    const input = { ipcPath: '/path/with spaces.ipc' }
    const settings = [
      {
        id: 'ipcPath',
        flag: '--ipc %s'
      }
    ]

    const flags = generateFlags(input, settings)
    expect(flags).toEqual(['--ipc', '/path/with spaces.ipc'])
  })
})

describe('generateFlags error handling', () => {
  it('should throw if settings is not an array', () => {
    const input = {}
    const settings = {
      cache: { flag: '--cache %s' },
      syncmode: { flag: '--syncmode %s' }
    }

    expect(() => generateFlags(input, settings)).toThrow(
      'Settings must be an Array instance'
    )
  })

  it('should throw for basic field without flag', () => {
    const input = { network: 'main' }
    const settings = [{ id: 'network' }]

    expect(() => generateFlags(input, settings)).toThrow(
      'Config entry "network" must have the "flag" key'
    )
  })

  it('should throw for simple options without flag', () => {
    const input = { sync: 'fast' }
    const settings = [
      {
        id: 'sync',
        options: ['light', 'fast', 'full']
      }
    ]

    expect(() => generateFlags(input, settings)).toThrow(
      'Option "fast" must have the "flag" key'
    )
  })

  it('should throw for full options without flag', () => {
    const input = { network: 'main' }
    const settings = [
      {
        id: 'network',
        options: [{ value: 'main', label: 'Main' }]
      }
    ]

    expect(() => generateFlags(input, settings)).toThrow(
      'Option "main" must have the "flag" key'
    )
  })
})
