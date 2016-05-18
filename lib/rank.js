var validate = require('module-data/validate')
var score = require('./score-weight')

var weights = {
  reliability: 1,
  license: 1,
  security: 1
}

module.exports = rank

function rank (data, options, cb) {
  validate('standard', data, function (err, deps) {
    if (err) {
      return cb(err)
    }

    Object.keys(deps).forEach(function (dep) {
      var crit = criteria(deps[dep], options)
      deps[dep].criteria = crit
      deps[dep].score = score(weights, crit)
    })

    return cb(null, deps)
  })
}

function criteria (mdl, options) {
  var whiteList = options.licensesWhiteList

  return {
    reliability: require('./rank/reliability')(mdl),
    license: require('./rank/license')(mdl, whiteList),
    security: require('./rank/security')(mdl)
  }
}
