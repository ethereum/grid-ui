let _ipc = window.__require ? window.__require('ipc') : {}

export default class IPC{
   // TODO use whitelist for valid commands or provide functions instead
   static send(msg, args){
     _ipc.send(msg, args)
   } 
}