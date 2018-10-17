class Is {
  renderer() {
    // running in a web browser
    if (typeof process === 'undefined') return true
    // node-integration is disabled
    if (!process) return true
    // We're in node.js somehow
    if (!process.type) return false
    return process.type === 'renderer'
  }
  main() {
    return !this.renderer()
  }
  dev() {
    return !!process.env.PORT
    //return process.env.NODE_ENV && (process.env.NODE_ENV.trim() === 'development')
  }
  prod() {
    return !this.dev()
  }
  windows(){
    return process.platform === 'win32'
  }
  mac(){
    return process.platform === 'darwin'
  }
  linux(){
    return process.platform === 'linux'
  }
}

module.exports = new Is()