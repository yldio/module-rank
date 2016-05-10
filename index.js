var Project = require('./lib/project')
var rank = require('./lib/rank')

var projectDataSource = function (done) {
  done()
}

var licensesWhiteList = require('./lib/licenses-whitelist')

module.exports = moduleRank
module.exports.config = config

function moduleRank (moduleName, version, done) {
  if (typeof version === 'function') {
    done = version
    version = 'latest'
  }

  var prj = new Project(moduleName, version)

  prj.loadDataSource(projectDataSource)
  prj.loadWhiteListOfLicenses(licensesWhiteList)

  prj.loadDetails(function (err) {
    if (err) {
      return done(err)
    }

    rank(prj, function (err, mdlRank) {
      if (err) {
        return done(err)
      }

      mdlRank.license = prj.license
      return done(null, mdlRank)
    })
  })
}

function config (options) {
  var dataSource = options.dataSource
  var whiteList = options.licensesWhiteList

  if (dataSource && typeof dataSource === 'function') {
    projectDataSource = dataSource
  }

  if (whiteList && Array.isArray(whiteList)) {
    licensesWhiteList = whiteList
  }
}
