import ipc from './Ipc'

const MistApi = {
  requestAccount: () => {
    // window.mist.requestAccount
  },
  setWindowSize(w, h){
    ipc.send('backendAction_setWindowSize', w, h);
  },
  sendTransaction(){
    ipc.send('backendAction_sendTx', {});
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