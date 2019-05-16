import React from 'react'

// Network<>chainId Helpers
const networks = {
  1: 'main',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan',
  1337: 'private'
}
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}
export const chainIdToNetwork = chainId => {
  return networks[chainId]
}
export const networkToChainId = network => {
  return Number(getKeyByValue(networks, network))
}

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
