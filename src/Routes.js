import React from 'react'
import { Route, Redirect, Switch } from "react-router-dom"
import Wallet from "./containers/Wallet"
import AccountDetails from "./containers/Wallet/AccountDetails"
import Browser from './containers/Browser'
import Dapps from './containers/Dapps'
import Tools from './containers/Tools'

import CreateAccount from "./containers/Wallet/Account/CreateAccount"

import SendTx from './containers/Tx/SendTx'
import TxHistory from './containers/Tx/History'

import Validation from './containers/Tools/Validation'
import Conversion from './containers/Tools/Conversion'
import Rpc from './containers/Tools/Rpc'

import NetworkConfig from './containers/Network/Config'
import NodeConfig from './containers/Network/NodeConfig'


//<Browser tabs={this.state.tabs}/>


export default () =>
<Switch>
  {window.location.href.endsWith('index.html') && <Redirect to="/" />}

  <Route path="/" exact component={Wallet} />
  <Route path="/wallet" exact component={Wallet} />
  <Route path="/account/create" exact component={CreateAccount} />
  <Route path="/tx" exact component={Wallet} />
  <Route path="/tx/send" exact component={SendTx} />
  <Route path="/tx/history" exact component={TxHistory} />
  <Route path="/tools" exact component={Tools} />
  <Route path="/tools/validation" exact component={Validation} />
  <Route path="/tools/conversion" exact component={Conversion} />
  <Route path="/tools/rpc" exact component={Rpc} />
  <Route path="/network" exact component={Wallet} />
  <Route path="/network/config" exact component={NetworkConfig} />
  <Route path="/network/nodeconfig" exact component={NodeConfig} />

  <Route path="/dapps" exact component={Dapps} />
  <Route path="/browser/:url" exact component={Browser} />
  <Route path="/browser" exact component={Browser} />
  <Route path="/account/:address" exact component={AccountDetails} />
</Switch>;
