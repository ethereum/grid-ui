const { execSync } = require('child_process')
const path = require('path')
const _fs = require('fs')
const asar = require('asar')
const crypto = require('crypto')
const GitHub = require('@octokit/rest')
require('colors')

require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
})

const sign = crypto.createSign('SHA256')
const fail = '\u2717'.red
const basePath = path.join(__dirname, '..') // point to top-level folder

const TOKEN = process.env.MIST_UI_GITHUB_TOKEN
const PRIVATEKEY = '' // TODO get private key ...

const github = new GitHub()
const githubBaseOpts = {
  owner: 'PhilippLgh', 
  repo: 'mist-ui-react'
}
github.authenticate({type: 'token', token: TOKEN})

const fs = {
  readFile(filePath){
    return new Promise((resolve, reject) => {
      _fs.readFile(filePath, (err, data) =>{
        if(err) {return reject(err)}
        resolve(data)
      })
    })
  },
  writeFile(filePath, data){
    return new Promise((resolve, reject) => {
      _fs.writeFile(filePath, data, (err, d) => {
        if(err) {return reject(err)}
        resolve(filePath)
      })
    })
  }
}

function shasum(data, alg){
  return crypto.createHash(alg || 'sha256').update(data).digest('hex')
}

function runScript (scriptName, scriptArgs, cwd) {
  let scriptCommand = `${scriptName} ${scriptArgs.join(' ')}`
  let scriptOptions = {
    encoding: 'UTF-8'
  }
  if (cwd) {
    scriptOptions.cwd = cwd
  }
  try {
    execSync(scriptCommand, scriptOptions)
    return Promise.resolve()
  } catch (err) {
    console.log(`${fail} Error running ${scriptName}`, err)
    Promise.reject()
    process.exit(1)
  }
}

function packageApp(packageJson){
  const src = path.join(basePath, 'build')
  const dest = path.join(basePath, 'build', `react_ui_${packageJson.version}.asar`)
  return new Promise((resolve, reject) => {
    asar.createPackage(src, dest, function() {
      resolve(dest)
    })
  })
}

async function createChecksums(filePath){
  const data = await fs.readFile(filePath)
  return {
    'sha1': shasum(data, 'sha1'), 
    'sha256': shasum(data, 'sha256'), 
    'sha512': shasum(data, 'sha512') 
  }
}

// see https://github.com/octokit/rest.js/pull/629
async function uploadAsset (filePath, fileName, release) {
  // const contentType = mime.contentType(name) || 'application/octet-stream';
  const contentType = fileName.endsWith('.txt') ? 'text/plain' : 'application/octet-stream'
  const contentLength = _fs.statSync(filePath).size
  let githubOpts = {
    ...githubBaseOpts,
    url: release.upload_url,
    file: _fs.createReadStream(filePath),
    contentType,
    contentLength,
    name: fileName
  }
  return github.repos.uploadAsset(githubOpts)
    .catch(err => {
      console.log(`${fail} Error uploading ${filePath} to GitHub:`, err)
      process.exit(1)
    })
}

async function publishRelease (release) {
  let githubOpts = {
    ...githubBaseOpts,
    release_id: release.id,
    tag_name: release.tag_name,
    draft: false
  }
  return github.repos.editRelease(githubOpts)
    .catch(err => {
      console.log(`${fail} Error publishing release:`, err)
      process.exit(1)
    })
}

(async function release(){
  try {
    // TODO delete previous drafts
    /*
    let releaseInfo = await github.repos.getReleases({...githubBaseOpts})
    if(releaseInfo.status === 200) {
      console.log('release info', releaseInfo.data)
    }
    */
    const packageJson = require(path.join(basePath, 'package.json'))
    
    console.log('step 1: building the app')
    await runScript('yarn build', [], path.join(__dirname, '..'))

    console.log('step 1b: generating package metadata')
    let metadata = {
      name: 'Mist React UI',
      version: packageJson.version,
      notes: 'test test',
      size: '5MB',
      dependencies: {
        'mist-api': 'v0.0.0',
        'mist-backend': 'v0.0.0'
      },
      // ...checksums
    }
    const metadataPath = path.join(basePath, 'build', 'metadata.json')
    await fs.writeFile(metadataPath, JSON.stringify(metadata))

    console.log('step 2: bundling the app.asar')
    const asarPath = await packageApp(packageJson)
    // const asarPath = path.join(basePath, 'build', `react_ui_${packageJson.version}.asar`)
    console.log('step 3: creating asar checksums')
    const checksums = await createChecksums(asarPath)
    console.log('step 4: generating release metadata')
    metadata = {
      ...metadata,
      ...checksums
    }
    // const metastr = JSON.stringify(metadata)
    // sign.update(metastr)
    // const signature = sign.sign(PRIVATEKEY, 'hex')
    // metadata.signature = signature
    // const metadataPath = path.join(basePath, 'build', 'metadata.json')
    await fs.writeFile(metadataPath, JSON.stringify(metadata))
    console.log('step 5: creating draft & uploading assets')
    let ts = Math.floor(new Date().getTime() / 1000)
    let response = await github.repos.createRelease({
      ...githubBaseOpts,
      tag_name: `v${packageJson.version}_${ts}`,
      draft: true
    })
    let draftRelease = response.data
    // console.log('draft', draftRelease)
    console.log('uploading metadata')
    await uploadAsset(metadataPath, 'metadata.json', draftRelease)
    console.log('uploading asar package')
    await uploadAsset(asarPath, 'react_ui.asar', draftRelease)
    // TODO delete draft if uploads fail
    console.log('step 6: publishing release')
    await publishRelease(draftRelease)

    // TODO publish metadata to s3
    console.log('done', metadata)
  } catch (error) {
    console.error(error)
  }
})()
