const path = require('path')
const {app, BrowserWindow} = require('electron')

/*
//const Updater = require('./updater')
const setupReactUI = require('./mist-integration')
setupReactUI({
  mode: 'inject' // || separate
})
*/

function createWindow (asarPath) {

  const PORT = 3000

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
  createWindow()
})

/*
function start() {
  Updater.on('app-ready', (asarPath) => {
    console.log('found asar file', asarPath)
    createWindow(asarPath)
  })
  Updater.start()
}
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