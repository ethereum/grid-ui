import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default class Webview extends Component {
  constructor(props) {
    super()
  }
  render() {
    return (
      <div className="webview">
        <webview src={this.checkedUrl()} autosize="true"></webview>
      </div>
    )
  }
  checkedUrl(){
    return 'http://www.ethereum.org'
  }
  componentDidMount() {
    console.log('webview was mounted')
    let el = ReactDOM.findDOMNode(this)
    el.addEventListener('will-navigate', this.handleNavigate)
  }
  componentWillUnmount() {
    let el = ReactDOM.findDOMNode(this)
    el.removeEventListener('will-navigate', this.handleNavigate)
  }
  handleNavigate() {
    console.log('navigate navigate')
  }
}