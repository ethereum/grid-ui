import ipc from './Ipc'

function showPopup(name, args){
  ipc.send('backendAction_showPopup', {
    name,
    args
  })
}

let _mist = window._mist

const MistApi = {
  requestAccount: () => {
    // window.mist.requestAccount
  },
  setWindowSize(w, h){
    ipc.send('backendAction_setWindowSize', w, h);
  },
  getWindowArgs(){
    let args = {}
    if(_mist){
      args = _mist.window.getArgs()
    }
    return args
  },
  closeThisWindow(){
    if(_mist){ _mist.window.close() }
  },
  createAccount(args){
    showPopup('CreateAccount', args)
  },
  connectAccount(args){
    showPopup('ConnectAccount', args)
  },
  sendTransaction(args){
    showPopup('SendTx', args)
  },
  showHistory(args){
    showPopup('TxHistory', args)
  },
  createAccountWeb3(){

  },
  // replaces GlobalNotification
  notification: {
    warn:(msg) => {
      console.log('warn warn', msg)
      if(_mist){ _mist.notification.warn(msg.content)}
      /*
          GlobalNotification.warning({
            content: error.message || error,
            duration: 5
          });
      */
    }
  }
}

export default MistApi