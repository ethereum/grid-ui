import React, { Component } from 'react'
import PropTypes from 'prop-types'
import configureStore from '../store'

const store = configureStore()

// Wrapper around redux provider implementations
// that allows to use different approaches for renderer-main sync
class Provider extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    // set props on children: https://stackoverflow.com/a/32371612
    const { children } = this.props

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { ...store.getState() })
    )

    return <div>{childrenWithProps}</div>
  }
}

export default Provider
