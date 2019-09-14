import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import './scrollbar-fix.css'
import { Provider } from 'react-redux'
import App from './components/App'
import { Grid } from './API'
import configureStore from './store'
import Webview from './components/Webview'
import Apps from './components/Apps'
import Window from './components/Window'

const store = configureStore()
const root = document.getElementById('root')
const args = (Grid && Grid.window && Grid.window.getArgs()) || {}

let themeMode = 'dark'
if (args.scope && args.scope.themeMode === 'light') {
  themeMode = 'light'
}

if (args.isApp) {
  ReactDOM.render(
    <Window>
      <Provider store={store}>
        <Webview url={args.url} />
      </Provider>
    </Window>,
    root
  )
} else if (args.scope && args.scope.component === 'apps') {
  ReactDOM.render(
    <Window>
      <Provider store={store}>
        <div
          className="scroll-container"
          style={{ height: '100%', overflowY: 'auto' }}
        >
          <Apps />
        </div>
      </Provider>
    </Window>,
    root
  )
} else {
  ReactDOM.render(
    <Window>
      <Provider store={store}>
        <App themeMode={themeMode} />
      </Provider>
    </Window>,
    root
  )
}
