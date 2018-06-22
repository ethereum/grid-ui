const path = require('path')
const {app, BrowserWindow, Menu, MenuItem} = require('electron')


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

class WindowManager {
  showPopup(name) {
    console.log('show popup ', name)
    let popup = new BrowserWindow({
      parent: win, // The child window will always show on top of the top window.
      modal: true,
      width: 800, 
      height: 400,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    popup.loadURL('http://localhost:3000/index.html?app=popup')
  }
}
const windowManager = new WindowManager()

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200, 
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  //win.loadFile('index.html')
  win.loadURL('http://localhost:3000')

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
  const testPopupSubMenu = new Menu()
  testPopupSubMenu.append(new MenuItem({
    label: 'ClientUpdateAvailable',
    click: () => {
      windowManager.showPopup('ClientUpdateAvailable')
    }
  }))
  const menu = new Menu()
  menu.append(new MenuItem({label: 'Test', submenu: testPopupSubMenu}))
  Menu.setApplicationMenu(menu)
  createWindow()
})


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