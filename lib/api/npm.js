var request = require('request')

function NpmApi (moduleName) {
  this.moduleName = moduleName
}

NpmApi.prototype.view = function (cb) {
  return function (next) {
    request({
      method: 'GET',
      uri: 'http://registry.npmjs.org/' + this.moduleName,
      json: true
    }, function (err, res) {
      if (err || Object.keys(res.body).length < 1) {
        return next(err || new Error('Module not found'))
      }

      return cb(next, res.body)
    })
  }
}

NpmApi.prototype.lastMonthDownloads = function (cb) {
  return function (next) {
    request({
      method: 'GET',
      uri: 'https://api.npmjs.org/downloads/point/last-month/' + this.moduleName,
      json: true
    }, function (err, res) {
      if (err || res.body.error || !res.body.downloads) {
        return next(err || new Error(res.body.error))
      }

      return cb(next, res.body.downloads || 0)
    })
  }
}

NpmApi.prototype.getDependents = function (cb) {
  return function (next) {
    request({
      method: 'GET',
      uri: 'http://registry.npmjs.org/-/_view/dependedUpon?group_level=2&startkey=%5B%22' +
        this.moduleName + '%22%5D&endkey=%5B%22' + this.moduleName + '%22%2C%7B%7D%5D&skip=0',
      json: true
    }, function (err, res) {
      if (err) {
        return next(err)
      }

      // no dependents
      if (!(Array.isArray(res.rows)) || res.rows.length < 1) {
        return cb(next, [])
      }

      var deps = res.rows.map(function (row) {
        // sane check
        if (!(Array.isArray(row.key)) || row.key.length !== 2) {
          return 0
        }

        return row.key[1]
      })

      return cb(next, deps)
    })
  }
}

module.exports = NpmApi
