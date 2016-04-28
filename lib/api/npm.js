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

NpmApi.prototype.getDependents = function (done) {
  return function () {
    request({
      method: 'GET',
      uri: 'http://registry.npmjs.org/-/_view/dependedUpon?group_level=2&startkey=%5B%22' +
        this.moduleName + '%22%5D&endkey=%5B%22' + this.moduleName + '%22%2C%7B%7D%5D&skip=0'
    }, function (err, res) {
      if (err) {
        return done(err)
      }

      // no dependents
      if (!(Array.isArray(res.rows)) || res.rows.length < 1) {
        return done(null, [])
      }

      var deps = res.rows.map(function (row) {
        // sane check
        if (!(Array.isArray(row.key)) || row.key.length !== 2) {
          return 0
        }

        return row.key[1]
      })

      return done(null, deps)
    })
  }
}

module.exports = NpmApi
