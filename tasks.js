/*

use a static glob pattern or task

const fs = require('fs')
async function copyFile(source, target) {
  var rd = fs.createReadStream(source);
  var wr = fs.createWriteStream(target);
  try {
    return await new Promise(function(resolve, reject) {
      rd.on('error', reject);
      wr.on('error', reject);
      wr.on('finish', resolve);
      rd.pipe(wr);
    });
  } catch (error) {
    rd.destroy();
    wr.end();
    throw error;
  }
}
    [
      'Copy Files',
      async () => {
        const basePath = process.cwd()
        let p = path.join(basePath, 'preload', 'preload.js')
        let dest = path.join(basePath, 'build', 'preload.js')
        await copyFile(p, dest)

        let i18n = path.join(basePath, 'build', 'i18n')
        if (!fs.existsSync(i18n)) {
          fs.mkdirSync(i18n)
        }

        let eng1 = path.join(basePath, 'i18n', 'app.en.i18n.json')
        await copyFile(eng1, path.join(i18n, 'app.en.i18n.json'))

        let eng2 = path.join(basePath, 'i18n', 'mist.en.i18n.json')
        await copyFile(eng2, path.join(i18n, 'mist.en.i18n.json'))

        return true
      }
    ],
*/
let tasks = [
  [
    "Copy i18n",
    async () => true
  ]
]

module.exports = {
  postAppBuild: tasks
}