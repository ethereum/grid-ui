const { webFrame, ipcRenderer, remote } = require('electron')
const { dialog } = remote

let inject = `window.ethereum = {
  hello: (text) => {console.log('hello '+ text)},
  ${['enable'].map(fnName => `${fnName}: function(){document.dispatchEvent(new CustomEvent('ethereum-api-call', {detail: { method: '${fnName}' }}))}` )}
}
document.dispatchEvent(new Event('ethereum-api-access-granted'))
`
function setupAPI() {
  document.addEventListener('ethereum-api-call', (e) => {
    console.log('received api call', e)
    let method = e.detail.method
    if (method === 'enable') {
      ipcRenderer.sendToHost('ethereum-api-call', {
        fn: 'enable'
      });
    }
  })
  webFrame.executeJavaScript(inject)
}

function DOMContentLoaded(event) {
  ipcRenderer.sendToHost('on-dom-content-loaded', null);
  document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false)
}

function ApiRequested() {
  dialog.showMessageBox({
    title: 'Permission Requested',
    type: 'warning',
    message: 'Website requested access to Mist API',
    buttons: ['Deny', 'Allow']
  }, (btnIdx) => {
    if (btnIdx === 0) {
      // user denied access => no-op to avoid fingerprinting / detection
    } else if (btnIdx === 1) {
      setupAPI()
    } else {
      // TODO log unknown btn click
    }
  })
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded, false)
document.addEventListener("request-ethereum-api-access", ApiRequested, false)