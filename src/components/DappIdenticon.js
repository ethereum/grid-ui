import React, { Component } from 'react'

export default class DappIdenticon extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <span>{this.props.identity}</span>
    )
  }
}