import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Webview from './Webview'
import Spinner from '../Spinner'

// globals
const { i18n } = window

export default class Webviews extends Component {
  static propTypes = {
    tabs: PropTypes.any,
    onIconAvailable: PropTypes.func,
    onTitleAvailable: PropTypes.func,
    selectedTab: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.isLoading = false
  }

  connectionInfo = () => {
    return i18n.t('mist.nodeInfo.connecting')
  }

  render() {
    const {
      tabs = [],
      onIconAvailable,
      onTitleAvailable,
      selectedTab
    } = this.props

    return (
      <main>
        {this.isLoading ? (
          <div className="layout_webviews-loadingIndicator">
            <span>{this.connectionInfo()}</span>
            <Spinner />
          </div>
        ) : (
          tabs.map(tab => {
            const tabId = tab._id

            return (
              <Webview
                key={tabId}
                url={tab.url}
                visible={selectedTab._id === tabId}
                onIconAvailable={icon => {
                  onIconAvailable(tab, icon)
                }}
                onTitleAvailable={title => {
                  onTitleAvailable(tab, title)
                }}
              />
            )
          })
        )}
      </main>
    )
  }
}
