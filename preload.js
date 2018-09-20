const babelRegister = require('babel-register');
process.env.NODE_ENV = 'development'
babelRegister({
  ignore: /\/(build|node_modules)\//,
  presets: ['env', 'react-app'],
});

// fakeAPI simulates an environment with all required globals such as i18n or web3 so that the code
// is not breaking, however the functionality will obviously not work 
// create mocks / stubs / fakes for global variables and APIs
//let fakeAPI = require('./src/fakeAPI')
//moved to App.js so that it works in the browser too

window.dirname = __dirname
