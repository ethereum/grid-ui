const path = require('path')
const Updater = require('./updater')
const {app, dialog, BrowserWindow, Menu, MenuItem} = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const PORT = process.env.PORT || 3000
console.log('start shell with port: ', PORT)

class WindowManager {
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

function createWindow (asarPath) {
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  let popupMenu = (name) => {return new MenuItem({
    label: name,
    click: () => {
      windowManager.showPopup(name)
    }
  })}

  const testPopupSubMenu = new Menu()
  testPopupSubMenu.append(popupMenu('ClientUpdateAvailable'))
  testPopupSubMenu.append(popupMenu('ConnectAccount'))
  testPopupSubMenu.append(popupMenu('SendTransactionConfirmation'))
  const menu = new Menu()
  menu.append(new MenuItem({label: 'Test', submenu: testPopupSubMenu}))
  Menu.setApplicationMenu(menu)
  
  // createWindow()
  start()

})

function start() {
  Updater.on('app-ready', (asarPath) => {
    console.log('found asar file', asarPath)
    createWindow(asarPath)
  })
  Updater.start()
}
/*
Updater.on('update-available', () => {})
Updater.on('update-ready', () => {
  dialog.showMessageBox({
    title: 'update available',
    message: 'will now restart'
  }, () => {
    createWindow()
  })
})
*/

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.