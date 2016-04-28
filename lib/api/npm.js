var exec = require('child_process').exec
var request = require('request')

function NpmApi (moduleName) {
  this.moduleName = moduleName
}

NpmApi.prototype.view = function (done) {
  return function () {
    exec('npm view ' + this.moduleName, function (err, stdout, stderr) {
      if (err || stderr) {
        return done(err || stderr)
      }

      // TODO: Nasty hack, need to improve this
      try {
        stdout = stdout.trim()
        var obj
        eval('obj = ' + stdout) // eslint-disable-line no-eval

        return done(null, obj)
      } catch (e) {
        return done(e)
      }
    })
  }
}

NpmApi.prototype.lastMonthDownloads = function (done) {
  return function () {
    request({
      method: 'GET',
      uri: 'https://api.npmjs.org/downloads/point/last-month/' + this.moduleName
    }, function (err, res) {
      if (err || res.body.error || !res.body.downloads) {
        return done(err || new Error(res.body.error))
      }

      return done(null, res.body.downloads || 0)
    })
  }
}

module.exports = NpmApi
