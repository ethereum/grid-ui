// replicate subset of Mongo.Collection functionality to get rid of mongo dependency
// let Tabs = new Mongo.Collection('tabs', { connection: null });
// see dbSync.js
export default class CollectionLight {
  constructor(name){
    this._name = name
    this.items = {}
    this.synchronize()
  }
  get array(){
    let arr = []
    for (const key in this.items) {
      arr.push(this.items[key])
    }
    return arr
  }
  onceSynced(){
    return Promise.resolve()
  }
  remove(){
    this.items = {}
  }
  insert(value){
    this.items[value._id] = value
  }
  upsert(key, value){
    this.items[key] = value
  }
  findOne(){
    return null
  }
  synchronize(){
    let ipc = window.ipc
    if (typeof window.dbSync !== 'undefined') {
      this.remove({})
      //FIXME sync IPC
      const dataJson = ipc.sendSync('dbSync-reloadSync', {
        collName: this._name
      });
      dataJson.forEach(record => {
        if(record._id) {
          record.id = record._id
          this.upsert(record._id, record)
        } else {
          this.insert(record)
        }
      })
      console.log('data', dataJson)
    }
  }
}