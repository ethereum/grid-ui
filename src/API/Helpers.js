import LocalStore from './LocalStore'

class Helpers {
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
    var webview = this.getWebview(LocalStore.get('selectedTab'));
    return webview
  }
}

export default new Helpers()
