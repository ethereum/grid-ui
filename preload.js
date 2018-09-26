const babelRegister = require('babel-register');
process.env.NODE_ENV = 'development'
babelRegister({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'react-app'],
});

const {ipcRenderer} = require('electron')

const fs = require('fs')
const path = require('path')

// TODO WARNING not browser compatible -> needs to be mocked
window.__fs = fs
window.__path = path

// fakeAPI simulates an environment with all required globals such as i18n or web3 so that the code
// is not breaking, however the functionality will obviously not work 
// create mocks / stubs / fakes for global variables and APIs
//let fakeAPI = require('./src/fakeAPI')
//moved to App.js so that it works in the browser too

window.dirname = __dirname
window.__dirname = __dirname

window.__require = function(name){
  if(name === 'ipc') {
    return ipcRenderer
  }
}