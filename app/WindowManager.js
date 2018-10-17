const path = require('path')
const is = require('./utils/is')
const url = require('url')
const { BrowserWindow } = require('electron')

const devSettings = {
  openDevTools: (category) => {
    let openFor = ['renderer', 'popup']
    //return openFor.includes(category)
    return true
  }
}
let forceDevTools = true

let win;

/*
BrowserWindow.prototype.loadPackage = (asarPath) => {
  let file = path.join(asarPath, 'index.html') // locate entry point in package
  console.log('load file:', file)
  this.loadFile(file)
}

export default class WindowManager {
  createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800, 
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true, // mist specific: defaults to nodeIntegration value
        preload: path.join(__dirname, 'preload.js')
      }
    });

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null;
    });

    return win;
  }
  loadPackage(asarPath){
    let file = path.join(asarPath, 'index.html') // locate entry point in package
    win.loadFile(file)
  }
}
*/

const PORT = process.env.PORT || 3000


let preloadPath = path.join(__dirname, '..', 'preload', 'preload.js')
// TODO if path does not exist process.exit()

class WindowManager {

  createWindow (asarPath) {
    // Create the browser window.
    win = new BrowserWindow({
      width: 1100, 
      height: 720,
      webPreferences: {
        preload: preloadPath
      }
    })
  
    // Open the DevTools.
    if((forceDevTools || is.dev()) && devSettings.openDevTools('renderer')){
      win.webContents.openDevTools()
    }
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })

    return win
  }
  showPopup(name, args) {
    let options = {
      width: 800, 
      height: 400
    }
    let windowOptions = {}
    if (name === 'ClientUpdateAvailable') {
      windowOptions = {
        width: 600,
        height: 340,
        alwaysOnTop: false,
        resizable: false,
        maximizable: false
      }
    }
    if (name === 'RequestAccount' || name === 'CreateAccount') {
      windowOptions = {
        width: 450,
        height: 250,
        alwaysOnTop: true
      }
    }
    if (name === 'ConnectAccount') {
      windowOptions = {
        width: 460,
        height: 520,
        maximizable: false,
        minimizable: false,
        alwaysOnTop: true
      }
    }
    if (name === 'SendTransactionConfirmation') {
      windowOptions = {
        width: 580,
        height: 550,
        alwaysOnTop: true,
        enableLargerThanScreen: false,
        resizable: true
      }
    }
    if (name === 'SendTx') {
      windowOptions = {
        width: 580,
        height: 550,
        alwaysOnTop: true,
        enableLargerThanScreen: false,
        resizable: true
      }
    }
    if (name === 'TxHistory') {
      windowOptions = {
        width: 580,
        height: 465,
        alwaysOnTop: true,
        enableLargerThanScreen: false,
        resizable: true
      }
    }

    let config = Object.assign(options, windowOptions, {
      parent: win, // The child window will always show on top of the top window.
      modal: true,
      webPreferences: {
        preload: preloadPath
      }
    })

    let popup = new BrowserWindow(config)
    popup.args = args
    
    if (is.dev()) {
      const PORT = process.env.PORT
      if(PORT){
        popup.loadURL(`http://localhost:${PORT}/index.html?app=popup&name=${name}`)
      } // else TODO show error message
    } else {
      let ui = url.format({
        slashes: true,
        protocol: 'file:',
        pathname: path.resolve(__dirname, 'index.html'),
        query: {
          app: 'popup',
          name: name
        }
      })
      popup.loadURL(ui)
    }

    if((forceDevTools || is.dev()) && devSettings.openDevTools('popup')){
      popup.webContents.openDevTools({mode: 'detach'})
    }

    popup.setMenu(null)
  }
}

const windowManager = new WindowManager()
module.exports = windowManager