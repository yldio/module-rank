var Project = require('./lib/project')
var criteria = require('./lib/rank').criteria
var score = require('./lib/rank').score

module.exports = moduleRank

function moduleRank (moduleName, version, done) {
  if (typeof version === 'function') {
    done = version
    version = 'latest'
  }

  var prj = new Project(moduleName, version)

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
