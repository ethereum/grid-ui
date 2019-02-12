import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Tools from './containers/Tools'

import Validation from './containers/Tools/Validation'
import Conversion from './containers/Tools/Conversion'
import Rpc from './containers/Tools/Rpc'

import NetworkConfig from './containers/Network/Config'
import NodeSetup from './containers/Network/NodeSetup'
import NodeConfig from './containers/Network/NodeConfig'

// <Browser tabs={this.state.tabs}/>

export default function Routes() {
  return (
    <Switch>
      {window.location.href.endsWith('index.html') && <Redirect to="/" />}

      <Route path="/" exact component={NodeSetup} />
      <Route path="/tools" exact component={Tools} />
      <Route path="/tools/validation" exact component={Validation} />
      <Route path="/tools/conversion" exact component={Conversion} />
      <Route path="/tools/rpc" exact component={Rpc} />
      <Route path="/network/nodesetup" exact component={NodeSetup} />
      <Route path="/network/config" exact component={NetworkConfig} />
      <Route path="/network/nodeconfig" exact component={NodeConfig} />
    </Switch>
  )
}
