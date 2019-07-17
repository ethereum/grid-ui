import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import App from './components/App'
import Popup from './components/popups'
import { Grid } from './API'
import configureStore from './store'
import Webview from './components/Webview'
import Apps from './components/Apps'

const store = configureStore()

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

const args = (Grid && Grid.window && Grid.window.getArgs()) || {}

let themeMode = 'dark'
if (args.scope && args.scope.themeMode === 'light') {
  themeMode = 'light'
}

if (args.isApp) {
  ReactDOM.render(
    <Provider store={store}>
      <Webview url={args.url} />
    </Provider>,
    root
  )
} else if (args.scope) {
  if (args.scope.component === 'ui') {
    ReactDOM.render(
      <Provider store={store}>
        <App themeMode={themeMode} />
      </Provider>,
      root
    )
  } else {
    // args.scope.component === 'apps'
    ReactDOM.render(
      <Provider store={store}>
        <div style={{ margin: '24px' }}>
          <Apps />
        </div>
      </Provider>,
      root
    )
  }
} else {
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
        <Provider store={store}>
          <App themeMode={themeMode} />
        </Provider>,
        root
      )
      break
  }
}
