const { ipcRenderer } = require('electron')


function DOMContentLoaded(event) {
  const icon =
    document.querySelector('link[rel="apple-touch-icon"]') ||
    document.querySelector('link[type="image/x-icon"]') ||
    document.querySelector('link[rel="shortcut"]') ||
    document.querySelector('link[rel="shortcut icon"]') ||
    document.querySelector('link[rel="icon"]');

  if (icon) {
    ipcRenderer.sendToHost('favicon', icon.href)
  } else {
    ipcRenderer.sendToHost('favicon', null)
  }

  const appBar = document.querySelector(
    'meta[name="ethereum-dapp-url-bar-style"]'
  );

  if (appBar) {
    ipcRenderer.sendToHost('appBar', appBar.content);
  } else {
    ipcRenderer.sendToHost('appBar', null);
  }

  document.removeEventListener('DOMContentLoaded', DOMContentLoaded, false)
}

document.addEventListener('DOMContentLoaded', DOMContentLoaded, false)

window.prompt = () => {
  console.warn("Mist doesn't support window.prompt()")
}