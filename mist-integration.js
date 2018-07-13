const path = require('path')
const updater = require('./updater')
const {app, dialog, BrowserWindow, Menu, MenuItem} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const PORT = process.env.PORT || 3000
console.log('start react ui with devserver on port: ', PORT)

class WindowManager {
  createWindow (asarPath) {
    // Create the browser window.
    win = new BrowserWindow({
      width: 1100, 
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    // and load the index.html of the app.
    // win.loadFile('index.html')
    if(asarPath){
      win.loadFile(path.join(asarPath, 'index.html'))
    } else {
      win.loadURL(`http://localhost:${PORT}`)
    }
  
    // Open the DevTools.
    win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  showPopup(name) {
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

    let config = Object.assign(options, windowOptions, {
      parent: win, // The child window will always show on top of the top window.
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })

    let popup = new BrowserWindow(config)
    popup.loadURL(`http://localhost:${PORT}/index.html?app=popup&name=${name}`)

    popup.webContents.openDevTools({mode: 'detach'})


    popup.setMenu(null)
  }
}

const windowManager = new WindowManager()

function createReactMenu(){
  let popupMenu = (name, label) => {return new MenuItem({
    label: label || name,
    click: () => {
      windowManager.showPopup(name)
    }
  })}

  const testPopupSubMenu = new Menu()
  testPopupSubMenu.append(popupMenu('ClientUpdateAvailable'))
  testPopupSubMenu.append(popupMenu('ConnectAccount'))
  testPopupSubMenu.append(popupMenu('SendTransactionConfirmation'))

  let reactSubMenu = new Menu()
  reactSubMenu.append(new MenuItem({
    label: 'Check Update',
    click: async () => {
      let update = await updater.checkUpdate()
      if (!update) {
        dialog.showMessageBox({title: 'No update', message: 'You are using the latest version'})
        return
      }
      dialog.showMessageBox({
        title: 'Checking for updates',
        message: `
        React UI update found: v${update.version} 
        Press "OK" to download in background
        `
      }, async () => {
        let download = await this.downloadUpdate(update)
        if (!download.error) {
          dialog.showMessageBox({title: 'Update downloaded', message: `Press OK to reload for update ${download.version}`})
        } else {
          dialog.showMessageBox({title: 'Download failed', message: `Error ${download.error}`})
        }
      })
    }
  }))
  reactSubMenu.append(new MenuItem({
    label: 'Reload -> update',
    enabled: false
  }))  
  reactSubMenu.append(popupMenu('Rollback'))
  reactSubMenu.append(new MenuItem({
    label: 'Popups',
    submenu: testPopupSubMenu
  }))
  reactSubMenu.append(popupMenu('ReactUiSettings', 'Settings'))
  reactSubMenu.append(new MenuItem({
    label: 'v.0.0.1'
  }))

  return reactSubMenu
}

function updateMenuVersion(){

}

function run(options) {
  let reactSubMenu = createReactMenu()
  // let menu = Menu.getApplicationMenu()
  const menu = new Menu()
  menu.append(new MenuItem({label: 'React UI', submenu: reactSubMenu}))
  Menu.setApplicationMenu(menu)

  if (updater.isReady) {
    windowManager.createWindow(updater.asarPath)
  } else {
    updater.once('app-ready', (asarPath) => {
      console.log('found asar file', asarPath)
      windowManager.createWindow(asarPath)
    })
  }
}

module.exports = run