import React, { Component } from 'react'

import Webview from './Webview'
import Spinner from './Spinner'

// globals
const i18n = window.i18n

export default class Webviews extends Component {
  constructor(){
    super()
    this.isLoading = false
  }
  connectionInfo(){
    return i18n.t('mist.nodeInfo.connecting')
  }
  render(){
    return (
      <main>
        {this.isLoading
        ? 
        <div className="layout_webviews-loadingIndicator">
          <span>{this.connectionInfo()}</span>
          <Spinner />
        </div>
        :
        this.props.tabs.map(tab => {
          let tabId = tab._id
          return <Webview 
            key={tabId} 
            url={tab.url} 
            visible={this.props.selectedTab._id === tabId}
            onIconAvailable={(icon) => {this.props.onIconAvailable(tab, icon)}}
            onTitleAvailable={(title) => {this.props.onTitleAvailable(tab, title)}}
          />
        })
        }
      </main>
    )
  }
}