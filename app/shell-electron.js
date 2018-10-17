const { app, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const is = require('./utils/is')

const windowManager = require('./WindowManager')

const updater = global.updater || {
  on: () => {}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  let win = windowManager.createWindow()

  if (is.dev()) {
    const PORT = process.env.PORT
    if(PORT){
      win.loadURL(`http://localhost:${PORT}`)
    } // else TODO show error message
  } else {
    //win.loadFile(path.join(__dirname, 'index.html'))
    win.loadURL(url.format({
      slashes: true,
      protocol: 'file:',
      pathname: path.resolve(__dirname, 'index.html/')
    }))
  }
  setupIpc()
})


function setupIpc(){
  ipcMain.on('backendAction_showPopup', (event, args) => {
    windowManager.showPopup(args.name, args.args)
  })
}


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

/*
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
*/

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.