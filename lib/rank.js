var childrenRank = require('./rank/children')

var weights = {
  reliability: 2,
  license: 2,
  maintenance: 2,
  popularity: 1,
  security: 2,
  childrenRank: 2
}

module.exports = rank

function rank (prj, cb) {
  var mdlRank = {}
  mdlRank.criteria = criteria(prj)

  childrenRank(prj, function (err, childrenRank) {
    if (err) {
      return cb(err)
    }

    mdlRank.criteria.childrenRank = childrenRank
    mdlRank.score = score(mdlRank.criteria)

    return cb(null, mdlRank)
  })
}

function criteria (prj) {
  return {
    reliability: require('./rank/reliability')(prj),
    license: require('./rank/license')(prj),
    maintenance: require('./rank/maintenance')(prj),
    popularity: require('./rank/popularity')(prj),
    security: require('./rank/security')(prj)
  }
}

function score (criteriaObj) {
  var totalWeight = 0
  var score = 0
  for (var k in weights) {
    totalWeight += weights[k]
    score += criteriaObj[k] * weights[k]
  }

  return (score / totalWeight).toFixed(2)
}
