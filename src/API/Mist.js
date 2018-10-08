import ipc from './Ipc'

const MistApi = {
  requestAccount: () => {
    // window.mist.requestAccount
  },
  setWindowSize(w, h){
    ipc.send('backendAction_setWindowSize', w, h);
  },
  sendTransaction(args){
    ipc.send('backendAction_showPopup', {
      name: 'SendTx',
      args
    });
  },
  showHistory(){
    ipc.send('backendAction_showPopup', {
      name: 'TxHistory'
    });
  },
  getWindowArgs(){
    return window.getArgs && window.getArgs()
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