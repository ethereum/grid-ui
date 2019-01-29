import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Browserbar from './Browserbar'
import Webviews from './Webviews'
import Webview from './Webview'

class Browser extends Component {
  static propTypes = {
    tabs: PropTypes.any,
    match: PropTypes.any,
    settings: PropTypes.any
  }

  constructor(props) {
    super(props)

    this.state = {
      tabs: [],
      url: ''
    }
  }

  handleIconAvailable = (tab, icon) => {
    if (tab.id === 'wallet') return
    this.setState(prevState => {
      const tabs = [...prevState.tabs] // copy tabs state
      const tabIdx = tabs.findIndex(t => t.id === tab.id) // find changed item
      const tabM = {
        ...tabs[tabIdx], // create copy of changed item
        icon // & modify copy
      }
      tabs[tabIdx] = tabM // write changes to new tabs state
      return { tabs }
    })
  }

  handleTitleAvailable = (tab, title) => {
    this.setState(prevState => {
      const tabs = [...prevState.tabs] // copy tabs state
      const tabIdx = tabs.findIndex(t => t.id === tab.id) // find changed item
      const tabM = {
        ...tabs[tabIdx], // create copy of changed item
        name: title // & modify copy
      }
      tabs[tabIdx] = tabM // write changes to new tabs state
      return { tabs }
    })
  }

  handleNavigate = url => {
    this.setState({ url })
  }

  handleReload = () => {}

  render() {
    const { tabs, match, settings } = this.props
    const { url: stateUrl } = this.state

    const accounts = []
    const selectedTab = tabs && tabs.length > 0 ? tabs[0] : undefined
    const tabUrl = selectedTab && selectedTab.url
    const urlParam = match.params.url
      ? decodeURIComponent(match.params.url)
      : ''
    const url =
      stateUrl ||
      urlParam ||
      tabUrl ||
      'https://github.com/ethereum/mist-ui-react'

    return (
      <Fragment>
        <Browserbar
          url={url}
          dappAccounts={accounts}
          selectedTab={selectedTab}
          onUrlChanged={this.handleNavigate}
          onReload={this.handleReload}
        />
        {url ? (
          <main>
            <Webview
              key="_browser_"
              url={url}
              visible
              onIconAvailable={() => {}}
              onTitleAvailable={() => {}}
              onNavigate={this.handleNavigate}
              userSettings={settings}
            />
          </main>
        ) : (
          <Webviews
            tabs={tabs}
            selectedTab={selectedTab}
            onIconAvailable={this.handleIconAvailable}
            onTitleAvailable={this.handleTitleAvailable}
          />
        )}
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.accounts,
    settings: state.settings.browser
  }
}

export default connect(mapStateToProps)(Browser)
