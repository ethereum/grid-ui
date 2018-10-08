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
    return window.getArgs && window.getArgs()
  },
  closeThisWindow(){
    console.log('close this window not implemented yet')
  },
  createAccount(){
    showPopup('CreateAccount')
  },
  connectAccount(){
    showPopup('ConnectAccount')
  },
  sendTransaction(args){
    showPopup('SendTx', args)
  },
  showHistory(){
    showPopup('TxHistory')
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