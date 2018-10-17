const path = require('path')
//const updater = require('./updater')
const {app, dialog, BrowserWindow, Menu, MenuItem} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const PORT = process.env.PORT || 3000
console.log('start react ui with devserver on port: ', PORT)


function createReactMenu(version){
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
  testPopupSubMenu.append(popupMenu('SendTx'))
  testPopupSubMenu.append(popupMenu('TxHistory'))
  testPopupSubMenu.append(popupMenu('Settings'))

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
        let download = await updater.downloadUpdate(update)
        if (!download.error) {
          dialog.showMessageBox({title: 'Update downloaded', message: `Press OK to reload for update to version ${download.version}`})
          let asarPath = download.filePath
          start(asarPath, download.version)
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
  reactSubMenu.append(popupMenu('Settings'))

  reactSubMenu.append(new MenuItem({
    label: `v${version}`
  }))

  return reactSubMenu
}

function updateMenuVersion(version){

  let menu = Menu.getApplicationMenu()
  if (menu) {
    let reactSubMenu = createReactMenu(version)
    let menuNew = new Menu()
    menu.items.forEach(m => {
      if(m.label === 'React UI') {
        return
      }
      menuNew.append(m)
    })
    menuNew.append(new MenuItem({label: 'React UI', submenu: reactSubMenu}))
    Menu.setApplicationMenu(menuNew)
  }
}

function start(asarPath, version){
  // update menu to display current version

  updateMenuVersion(version)

  if (win) {
    // TODO let window manager handle
    win.loadFile(path.join(asarPath, 'index.html'))
  } else {
    windowManager.createWindow(asarPath)
  }
}

function run(options) {
  let reactSubMenu = createReactMenu('0.0.0')
  // let menu = Menu.getApplicationMenu()
  const menu = new Menu()
  menu.append(new MenuItem({label: 'React UI', submenu: reactSubMenu}))
  Menu.setApplicationMenu(menu)

  /*
  if (updater.isReady) {
    start(updater.asarPath)
  } else {
    updater.once('app-ready', (asarPath, version) => {
      console.log('found asar file', asarPath, version)
      start(asarPath, version)
    })
  }
  */
}

module.exports = {
  setup: run,
  showPopup: windowManager.showPopup,
  createWindow: windowManager.createWindow
}