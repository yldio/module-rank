var Project = require('./lib/project')
var criteria = require('./lib/rank').criteria
var score = require('./lib/rank').score

module.exports = moduleRank

function moduleRank (moduleName, done) {
  var prj = new Project(moduleName)

  prj.loadDetails(function (err) {
    if (err) {
      return done(err)
    }

    var rank = {
      criteria: criteria(prj.export())
    }
    rank.score = score(rank.criteria)

    return done(null, rank)
  })
}
