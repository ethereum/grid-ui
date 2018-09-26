import React, { Component, Fragment } from 'react'

import Browserbar from './Browserbar'
import Webviews from './Webviews'
import Webview from './Webview'


class Browser extends Component {
  constructor(props){
    super(props)
    this.state = {
      tabs:[]
    }
  }
  handleIconAvailable = (tab, icon) => {
    if(tab.id === 'wallet') return
    this.setState(prevState => {
      let tabs = [...prevState.tabs] // copy tabs state
      let tabIdx = tabs.findIndex(t => (t.id === tab.id)) // find changed item
      let tabM = {
        ...tabs[tabIdx], // create copy of changed item
        icon: icon // & modify copy
      } 
      tabs[tabIdx] = tabM // write changes to new tabs state
      return {
        tabs: tabs 
      }
    })
  }  
  handleTitleAvailable = (tab, title) => {
    this.setState(prevState => {
      let tabs = [...prevState.tabs] // copy tabs state
      let tabIdx = tabs.findIndex(t => (t.id === tab.id)) // find changed item
      let tabM = {
        ...tabs[tabIdx], // create copy of changed item
        name: title // & modify copy
      } 
      tabs[tabIdx] = tabM // write changes to new tabs state
      return {
        tabs: tabs 
      }
    })
  }
  render(){
    let tabs = this.props.tabs || [{
      url: 'https://www.github.com/ethereum/mist-ui-react'
    }]
    let accounts = []
    let selectedTab = tabs[0]
    let url = selectedTab.url

    let urlParam = this.props.match.params.url ? decodeURIComponent(this.props.match.params.url) : ''

    return (
      <Fragment>
        <Browserbar 
          url={urlParam}
          dappAccounts = {accounts}
          selectedTab={selectedTab}/>
        {urlParam
        ?
        <main><Webview 
          key={'_browser_'} 
          url={urlParam} 
          visible={true}
          onIconAvailable={(icon) => {}}
          onTitleAvailable={(title) => {}}
        /></main>
       :
        <Webviews 
          tabs={tabs} 
          selectedTab={selectedTab}
          onIconAvailable={this.handleIconAvailable}
          onTitleAvailable={this.handleTitleAvailable}
        />
        }  
      </Fragment>

    )
  }
}

export default Browser
