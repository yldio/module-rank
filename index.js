var Project = require('./lib/project')
var criteria = require('./lib/rank').criteria
var score = require('./lib/rank').score

var projectDataSource = function (done) {
  done()
}

module.exports = moduleRank
module.exports.config = config

function moduleRank (moduleName, version, done) {
  if (typeof version === 'function') {
    done = version
    version = 'latest'
  }

  var prj = new Project(moduleName, version)

  prj.loadDataSource(projectDataSource)

  prj.loadDetails(function (err) {
    if (err) {
      return done(err)
    }

    var rank = {
      criteria: criteria(prj),
      license: prj.license
    }
    rank.score = score(rank.criteria)

    return done(null, rank)
  })
}

function config (options) {
  var dataSource = options.dataSource

  if (dataSource && typeof dataSource === 'function') {
    projectDataSource = dataSource
  }
}
