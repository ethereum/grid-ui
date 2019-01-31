import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import Popup from './Popup'
// import { Mist } from './API'
import store from './API/ReduxStore'

// see https://github.com/facebook/create-react-app/issues/1084#issuecomment-273272872
// Copied from http:jquery-howto.blogspot.com/2009/09/get-url-parameters-values-with-jquery.html
function getUrlVars() {
  const vars = []
  let hash
  const hashes = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&')
  for (let i = 0; i < hashes.length; i += 1) {
    hash = hashes[i].split('=')
    vars.push(hash[0])
    vars[hash[0]] = hash[1] // eslint-disable-line
  }
  return vars
}

const root = document.getElementById('root')

// retrieve popup name
const urlParams = getUrlVars()
const popupName = urlParams.name

const args = null // Mist.window.getArgs()
switch (urlParams.app) {
  case 'popup':
    store.dispatch({
      type: 'SET_TX',
      payload: args
    })
    ReactDOM.render(
      <Provider store={store}>
        <Popup name={popupName} popup={{ args }} />
      </Provider>,
      root
    )
    break
  case undefined:
  default:
    ReactDOM.render(
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>,
      root
    )
    break
}
