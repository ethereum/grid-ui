import React from 'react'

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

export const getPluginSettingsConfig = client => {
  try {
    const settings = client.plugin.config.settings // eslint-disable-line
    return Array.isArray(settings) ? settings : []
  } catch (e) {
    return []
  }
}

export const generateFlags = (userConfig, nodeSettings) => {
  if (!Array.isArray(nodeSettings))
    throw new Error('Settings must be an Array instance')
  const userConfigEntries = Object.keys(userConfig)
  let flags = []

  userConfigEntries.forEach(entry => {
    let flag
    let configEntry = nodeSettings.find(setting => setting.id === entry)
    let flagString = configEntry.flag

    if (flagString) {
      flag = flagString.replace(/%s/, userConfig[entry]).split(' ')
    } else if (configEntry.options) {
      const options = configEntry.options
      const selectedOption = options.find(
        option =>
          userConfig[entry] === option.value || userConfig[entry] === option
      )
      if (typeof selectedOption['flag'] !== 'string') {
        throw new Error(
          `Option "${selectedOption.value ||
            selectedOption}" must have the "flag" key`
        )
      }
      flag = selectedOption.flag.replace(/%s/, userConfig[entry]).split(' ')
    } else {
      throw new Error(`Config entry "${entry}" must have the "flag" key`)
    }
    flags = flags.concat(flag)
  })

  return flags.filter(flag => flag.length > 0)
}
