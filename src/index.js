import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Provider } from 'react-redux'
import App from './components/App'
import { Grid } from './API'
import configureStore from './store'
import Webview from './components/Webview'
import Apps from './components/Apps'

const store = configureStore()
const root = document.getElementById('root')
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
} else if (args.scope && args.scope.component === 'apps') {
  ReactDOM.render(
    <Provider store={store}>
      <div style={{ margin: '24px' }}>
        <Apps />
      </div>
    </Provider>,
    root
  )
} else {
  ReactDOM.render(
    <Provider store={store}>
      <App themeMode={themeMode} />
    </Provider>,
    root
  )
}
