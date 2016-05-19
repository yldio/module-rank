var validate = require('module-data/validate')
var score = require('./score-weight')
var omit = require('lodash.omit')

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
      var crit
      var w

      if (deps[dep].private) {
        crit = criteriaPrivate(deps[dep], options)
        w = omit(weights, 'security')
      } else {
        crit = criteriaPublic(deps[dep], options)
        w = weights
      }

      deps[dep].criteria = crit
      deps[dep].score = score(w, crit)
    })

    return cb(null, deps)
  })
}

function criteriaPublic (mdl, options) {
  var whiteList = options.licensesWhiteList

  return {
    reliability: require('./rank/reliability')(mdl),
    license: require('./rank/license')(mdl, whiteList),
    security: require('./rank/security')(mdl)
  }
}

function criteriaPrivate (mdl, options) {
  var whiteList = options.licensesWhiteList

  return {
    reliability: require('./rank/reliability')(mdl),
    license: require('./rank/license')(mdl, whiteList)
  }
}
