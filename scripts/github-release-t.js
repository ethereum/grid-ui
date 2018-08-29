'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var createChecksums = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filePath) {
    var data;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.readFile(filePath);

          case 2:
            data = _context.sent;
            return _context.abrupt('return', {
              'sha1': shasum(data, 'sha1'),
              'sha256': shasum(data, 'sha256'),
              'sha512': shasum(data, 'sha512')
            });

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createChecksums(_x) {
    return _ref.apply(this, arguments);
  };
}();

// see https://github.com/octokit/rest.js/pull/629


var uploadAsset = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(filePath, fileName, release) {
    var contentType, contentLength, githubOpts;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // const contentType = mime.contentType(name) || 'application/octet-stream';
            contentType = fileName.endsWith('.txt') ? 'text/plain' : 'application/octet-stream';
            contentLength = _fs.statSync(filePath).size;
            githubOpts = (0, _extends3.default)({}, githubBaseOpts, {
              url: release.upload_url,
              file: _fs.createReadStream(filePath),
              contentType: contentType,
              contentLength: contentLength,
              name: fileName
            });
            return _context2.abrupt('return', github.repos.uploadAsset(githubOpts).catch(function (err) {
              console.log(fail + ' Error uploading ' + filePath + ' to GitHub:', err);
              process.exit(1);
            }));

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function uploadAsset(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var publishRelease = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(release) {
    var githubOpts;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            githubOpts = (0, _extends3.default)({}, githubBaseOpts, {
              release_id: release.id,
              tag_name: release.tag_name,
              draft: false
            });
            return _context3.abrupt('return', github.repos.editRelease(githubOpts).catch(function (err) {
              console.log(fail + ' Error publishing release:', err);
              process.exit(1);
            }));

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function publishRelease(_x5) {
    return _ref3.apply(this, arguments);
  };
}();

var sleep = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(t) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', new _promise2.default(function (resolve, reject) {
              setTimeout(function () {
                resolve();
              }, t);
            }));

          case 1:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function sleep(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var execSync = require('child_process').execSync;
var path = require('path');
var _fs = require('fs');
var asar = require('asar');
var crypto = require('crypto');
var GitHub = require('@octokit/rest');
var semver = require('semver');

/*
require('dotenv').config({
  path: path.join(__dirname, '..', '.env')
})
*/

var sign = crypto.createSign('SHA256');
var fail = '\u2717'.red;
var basePath = path.join(__dirname, '..'); // point to top-level folder

var TOKEN = process.env.MIST_UI_GITHUB_TOKEN;
var PRIVATEKEY = ''; // TODO get private key ...

var github = new GitHub();
var githubBaseOpts = {
  owner: 'PhilippLgh',
  repo: 'mist-ui-react'
};
github.authenticate({ type: 'token', token: TOKEN });

var fs = {
  readFile: function readFile(filePath) {
    return new _promise2.default(function (resolve, reject) {
      _fs.readFile(filePath, function (err, data) {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  },
  writeFile: function writeFile(filePath, data) {
    return new _promise2.default(function (resolve, reject) {
      _fs.writeFile(filePath, data, function (err, d) {
        if (err) {
          return reject(err);
        }
        resolve(filePath);
      });
    });
  }
};

function shasum(data, alg) {
  return crypto.createHash(alg || 'sha256').update(data).digest('hex');
}

function runScript(scriptName, scriptArgs, cwd) {
  var scriptCommand = scriptName + ' ' + scriptArgs.join(' ');
  var scriptOptions = {
    encoding: 'UTF-8'
  };
  if (cwd) {
    scriptOptions.cwd = cwd;
  }
  try {
    execSync(scriptCommand, scriptOptions);
    return _promise2.default.resolve();
  } catch (err) {
    console.log(fail + ' Error running ' + scriptName, err);
    _promise2.default.reject();
    process.exit(1);
  }
}

function packageApp(packageJson) {
  var src = path.join(basePath, 'build');
  var dest = path.join(basePath, 'build', 'react_ui_' + packageJson.version + '.asar');
  return new _promise2.default(function (resolve, reject) {
    asar.createPackage(src, dest, function () {
      resolve(dest);
    });
  });
}

(function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var user, username, channel, packageJson, version, writeChanges, metadata, metadataPath, asarPath, checksums, ts, response, draftRelease;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return github.users.get({});

          case 3:
            user = _context5.sent;
            username = user.data.login || '';

            // parse channel info from args or use username as default channel

            channel = (process.argv.length > 2 ? process.argv[2] : username).toLowerCase();

            console.log('publish to channel:', channel);
            packageJson = require(path.join(basePath, 'package.json'));
            version = packageJson.version;


            console.log('previous version', version);
            writeChanges = false;

            if (semver.valid(version)) {
              if (channel === 'alpha') {
                version = semver.inc(version, 'patch');
              } else if (channel === 'beta') {
                version = semver.inc(version, 'minor');
              } else if (channel === 'release') {
                version = semver.inc(version, 'major');
              } else {
                writeChanges = false;
                version = semver.inc(version, 'prerelease', channel);
              }
              console.log('release version', version);
            }

            console.log('waiting for 5 sec: "ctrl + c" to cancel');
            _context5.next = 15;
            return sleep(5000);

          case 15:
            console.log('continuing release process..');

            if (writeChanges) {
              console.log('overwriting package.json version');
              fs.writeFile(path.join(basePath, 'package.json'), (0, _stringify2.default)((0, _extends3.default)({}, packageJson, {
                version: version
              }), null, 2));
            }

            console.log('step 1: building the app');
            _context5.next = 20;
            return runScript('yarn build', [], path.join(__dirname, '..'));

          case 20:

            console.log('step 1b: generating package metadata');
            metadata = {
              name: 'Mist React UI',
              version: version,
              channel: channel,
              notes: 'test test',
              size: '5MB',
              dependencies: {
                'mist-api': 'v0.0.0',
                'mist-backend': 'v0.0.0'
              }
              // ...checksums
            };
            metadataPath = path.join(basePath, 'build', 'metadata.json');
            _context5.next = 25;
            return fs.writeFile(metadataPath, (0, _stringify2.default)(metadata));

          case 25:

            console.log('step 2: bundling the app.asar');
            _context5.next = 28;
            return packageApp(packageJson);

          case 28:
            asarPath = _context5.sent;

            // const asarPath = path.join(basePath, 'build', `react_ui_${packageJson.version}.asar`)
            console.log('step 3: creating asar checksums');
            _context5.next = 32;
            return createChecksums(asarPath);

          case 32:
            checksums = _context5.sent;

            console.log('step 4: generating release metadata');
            metadata = (0, _extends3.default)({}, metadata, checksums);
            // const metastr = JSON.stringify(metadata)
            // sign.update(metastr)
            // const signature = sign.sign(PRIVATEKEY, 'hex')
            // metadata.signature = signature
            // const metadataPath = path.join(basePath, 'build', 'metadata.json')
            _context5.next = 37;
            return fs.writeFile(metadataPath, (0, _stringify2.default)(metadata));

          case 37:
            console.log('step 5: creating draft & uploading assets');
            ts = Math.floor(new Date().getTime() / 1000);
            _context5.next = 41;
            return github.repos.createRelease((0, _extends3.default)({}, githubBaseOpts, {
              tag_name: 'v' + packageJson.version + (channel ? '-' : '') + channel + '_' + ts,
              draft: true
            }));

          case 41:
            response = _context5.sent;
            draftRelease = response.data;
            // console.log('draft', draftRelease)

            console.log('uploading metadata');
            _context5.next = 46;
            return uploadAsset(metadataPath, 'metadata.json', draftRelease);

          case 46:
            console.log('uploading asar package');
            _context5.next = 49;
            return uploadAsset(asarPath, 'react_ui.asar', draftRelease);

          case 49:
            // TODO delete draft if uploads fail
            console.log('step 6: publishing release');
            _context5.next = 52;
            return publishRelease(draftRelease);

          case 52:

            // TODO publish metadata to s3
            console.log('done', metadata);
            _context5.next = 58;
            break;

          case 55:
            _context5.prev = 55;
            _context5.t0 = _context5['catch'](0);

            console.error(_context5.t0);

          case 58:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 55]]);
  }));

  function release() {
    return _ref5.apply(this, arguments);
  }

  return release;
})()();