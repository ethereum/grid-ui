// import LocalStore from './LocalStore'
export class Helpers {
  /**
  Get the webview from either and ID, or the string "browser"
  @method getWebview
  @param {String} id  The Id of a tab or the string "browser"
  */
  getWebview(id){
    // FIXME probably bad practice:
    // deprecate this and handle over states
    // return $('webview[data-id="' + id + '"]')[0]
  }

  getCurrentWebview(){
    //var webview = this.getWebview(LocalStore.get('selectedTab'));
    //return webview
    return null
  }

  static isMist() {
    return window.mistMode === 'mist'
  }

  static isElectron(){
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
      return true
    }
    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
      return true
    }
    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
      return true
    }
    return false
  }
}

export const is = {
  electron: Helpers.isElectron,
  mist: Helpers.isMist
}

