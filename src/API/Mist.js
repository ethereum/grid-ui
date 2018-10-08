import ipc from './Ipc'

function showPopup(name, args){
  ipc.send('backendAction_showPopup', {
    name,
    args
  })
}

const MistApi = {
  requestAccount: () => {
    // window.mist.requestAccount
  },
  setWindowSize(w, h){
    ipc.send('backendAction_setWindowSize', w, h);
  },
  getWindowArgs(){
    let args = window.getArgs && window.getArgs()
    return args || {}
  },
  closeThisWindow(){
    console.log('close this window not implemented yet')
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
  // replaces GlobalNotification
  notification: {
    warn:()=>{
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