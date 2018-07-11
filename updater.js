const fs = require('fs')
const fso = require('original-fs')
const path = require('path')
const http = require('http')
const https = require('https')
const EventEmitter = require('events').EventEmitter
const {app} = require('electron')

function download(url, w, progress = () => {}) {
  return new Promise((resolve, reject) => {
    let protocol = /^https:/.exec(url) ? https : http
    progress(0)
    protocol
      .get(url, res1 => {
        protocol = /^https:/.exec(res1.headers.location) ? https : http
        protocol
          .get(res1.headers.location, res2 => {
            const total = parseInt(res2.headers['content-length'], 10)
            let completed = 0
            res2.pipe(w)
            res2.on('data', data => {
              completed += data.length
              progress(completed / total)
            })
            res2.on('progress', progress)
            res2.on('error', reject)
            res2.on('end', () => resolve(w.path))
          })
          .on('error', reject)
      })
      .on('error', reject)
  })
}

class Updater extends EventEmitter {
  constructor() {
    super()
    // give listeners time to subscribe then auto-start?
    setTimeout(()=>{
      // this.start()
    }, 5 * 1000)
  }
  async start(){
    let canStartFromCache = this.checkCache()
    let update = await this.checkRepoForUpdate()
    if (update && !canStartFromCache) {
      let downloadPath = await this.downloadUpdate(update)
      // TODO verify integratiy and authenticity
      this.emit('app-ready', downloadPath)
    }
    this.startPollRoutine()
  }
  get userDataPath() {
    return app.getPath('userData')
  }
  get releaseDataPath() {
    return path.join(this.userDataPath, 'releases')
  }
  checkCache(){
    if (!fs.existsSync(this.releaseDataPath)) {return}
    let files = fs.readdirSync(this.releaseDataPath)
    let filePathsFull = files.map(f => (path.join(this.releaseDataPath, f)))
    // TODO get latest based on metadata
    // TODO verify integratiy and authenticity
    if (filePathsFull.length > 0) {
      this.emit('app-ready', filePathsFull[0])
    }
    return filePathsFull.lengths > 0
  }
  checkRepoForUpdate(){
    const author = 'PhilippLgh'
    const repoName = 'mist-ui-react'
    const baseURL = `https://github.com/${author}/${repoName}/releases/download`
    const version = 'test'
    const filename = 'ui.asar'
    let url = `${baseURL}/${version}/${filename}`

    return Promise.resolve({
      filename,
      url
    })
  }
  startPollRoutine(){
    /*
    setInterval(() => {
      this.checkRepoForUpdate()
    }, 60 * 60 * 1000)
    */
  }
  downloadUpdate(update){
    const {url, filename} = update
    const outputdir = this.releaseDataPath
    // TODO if not exists create
    const destf = path.join(outputdir, filename)
    const dest = fso.createWriteStream(destf)
  
    let pp = 0
    function onProgress(p) {
      let pn = Math.floor((p * 100))
      if(pn > pp) {
        pp = pn
        // console.log(`downloading update..  ${pn}%`)
      }
    }
  
    return download(url, dest, onProgress)
  }
}

module.exports = new Updater()