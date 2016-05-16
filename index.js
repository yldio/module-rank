var rank = require('./lib/rank')
var moduleDataValidate = require('module-data/validate')
var defaultLicensesWhiteList = require('./lib/licenses-whitelist')

module.exports = moduleRank

function moduleRank (mdlData, options, done) {
  if (typeof options === 'function') {
    done = options
    options = {}
  }

  moduleDataValidate('standard', mdlData, function (err) {
    if (err) {
      return done(new Error('module-rank called with an invalid module-data object.'))
    }

    options.licensesWhiteList = options.licensesWhiteList || defaultLicensesWhiteList

    return rank(mdlData, options, done)
  })
}
