const fs = require('fs')
const path = require('path')
let fakeAPI = require('./src/fakeAPI')

// load real i18n translations into the fake for a more
// authentic UI
let app = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'app.en.i18n.json')))
let mist = JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'mist.en.i18n.json')))

// fakeAPI simulates an evironment with all required globals such as i18n or web3 so that the code
// is not breaking, however the functionality will obviously not work 
// create mocks / stubs / fakes for global variables and APIs
fakeAPI(window, {
  ...app,
  ...mist
})

window.dirname = __dirname

// the idea is to use the fakeAPI only for quick testing and during transition to
// a Mist namespace:
window.Mist = {
  Tabs: [],
  History: [],
  LastVisitedPages: [],
  LocalStore: {}
}