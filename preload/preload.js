const babelRegister = require('babel-register');
const history = require('history')
process.env.NODE_ENV = 'development'
babelRegister({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'react-app'],
});

const {ipcRenderer, remote} = require('electron')
const {dialog} = remote

const fs = require('fs')
const path = require('path')

// TODO WARNING not browser compatible -> needs to be mocked
window.__fs = fs
window.__path = path

var currentWindow = remote.getCurrentWindow()

window._mist = {
  window: {
    getArgs: () => currentWindow.args,
    close: () => currentWindow.close()
  },
  notification: {
    warn: (msg) => {
      dialog.showMessageBox(currentWindow, {
        type: 'warning',
        buttons: [],
        message: ('' + msg)
      })
    }
  }
}

// fakeAPI simulates an environment with all required globals such as i18n or web3 so that the code
// is not breaking, however the functionality will obviously not work 
// create mocks / stubs / fakes for global variables and APIs
//let fakeAPI = require('./src/fakeAPI')
//moved to App.js so that it works in the browser too

window.__basedir = path.join(__dirname, '..')

window.__require = function(name){
  if(name === 'ipc') {
    return ipcRenderer
  }
}