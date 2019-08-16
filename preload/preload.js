process.env.NODE_ENV = 'development'

const { ipcRenderer, remote } = require('electron')

const { dialog } = remote

const fs = require('fs')
const path = require('path')

// TODO WARNING not browser compatible -> needs to be mocked
const i18nPath = path.join(__dirname, 'i18n')
const app = JSON.parse(fs.readFileSync(path.join(i18nPath, 'app.en.i18n.json')))
const mist = JSON.parse(
  fs.readFileSync(path.join(i18nPath, 'mist.en.i18n.json'))
)
window.__i18n = {
  ...app,
  ...mist
}

const currentWindow = remote.getCurrentWindow()

window._mist = {
  window: {
    getArgs: () => currentWindow.args,
    close: () => currentWindow.close()
  },
  notification: {
    warn: msg => {
      dialog.showMessageBox(currentWindow, {
        type: 'warning',
        buttons: [],
        message: `${msg}`
      })
    }
  }
}

window.__basedir = __dirname // path.join(__dirname, '..')

window.__require = function(name) {
  if (name === 'ipc') {
    return ipcRenderer
  }

  return null
}
