import React from 'react'
import { Grid } from '../API'

// calling styled(without('unneededProp')(TheComponent))
// helps satisfy error of extra StyledComponents props passing into children
// see: https://github.com/styled-components/styled-components/pull/2093#issuecomment-461510706
export const without = (...omitProps) => {
  const omitSingle = (object = {}, key) => {
    if (key === null || key === undefined || !(key in object)) return object
    const { [key]: deleted, ...otherKeys } = object
    return otherKeys
  }

  const omit = (object = {}, keys) => {
    if (!keys) return object
    if (Array.isArray(keys)) {
      // calling omitMultiple here would result in a second array check
      return keys.reduce((result, key) => {
        if (key in result) {
          return omitSingle(result, key)
        }
        return result
      }, object)
    }
    return omitSingle(object, keys)
  }
  // HoF
  return C => {
    const WithoutPropsComponent = ({ children, ...props }) => {
      return React.createElement(C, omit(props, omitProps), children)
    }
    return WithoutPropsComponent
  }
}

export const getPluginSettingsConfig = plugin => {
  try {
    const settings = plugin.plugin.config.settings // eslint-disable-line
    return Array.isArray(settings) ? settings : []
  } catch (e) {
    return []
  }
}

export const getDefaultSetting = (plugin, id) => {
  try {
    const setting = plugin.plugin.config.settings.find(
      setting => setting.id === id
    )
    return setting.default
  } catch (e) {
    return ''
  }
}

export const getSettingsIds = plugin => {
  try {
    return plugin.plugin.config.settings.map(setting => setting.id)
  } catch (e) {
    return []
  }
}

export const getPersistedPluginSettings = pluginName => {
  try {
    const settings = Grid.Config.getItem('settings')
    return settings[pluginName] || {}
  } catch (e) {
    return {}
  }
}

export const getPersistedFlags = pluginName => {
  try {
    const flags = Grid.Config.getItem('flags')
    return flags[pluginName] || null
  } catch (e) {
    return null
  }
}

export const getPersistedPluginSelection = () => {
  try {
    const settings = Grid.Config.getItem('settings')
    return settings.selected || ''
  } catch (e) {
    return ''
  }
}

export const getPersistedTabSelection = () => {
  try {
    const settings = Grid.Config.getItem('settings')
    return settings.selectedTab || 0
  } catch (e) {
    return 0
  }
}
