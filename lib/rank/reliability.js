var omit = require('lodash.omit')
var score = require('../score-weight')

var weights = {
  reasonableNumOfDeps: 2,
  reasonableNumOfSloc: 2,
  hasTests: 3,
  isNotOutdated: 3
}

module.exports = rank

function rank (mdl) {
  var reliabilityRank = {}
  reliabilityRank.criteria = criteria(mdl)
  reliabilityRank.score = score(
    weights,
    omit(reliabilityRank.criteria, 'isNotDeprecated')
  )

  reliabilityRank.score *= reliabilityRank.criteria.isNotDeprecated
  reliabilityRank.score = parseFloat(reliabilityRank.score.toFixed(2))

  return reliabilityRank
}

function criteria (mdl) {
  return {
    reasonableNumOfDeps: reasonableNumOfDeps(mdl),
    reasonableNumOfSloc: reasonableNumOfSloc(mdl),
    hasTests: hasTests(mdl),
    isNotOutdated: isNotOutdated(mdl),
    isNotDeprecated: isNotDeprecated(mdl)
  }
}

// Number of dependencies
// NOTE what is the number of deps accepted
function reasonableNumOfDeps (project) {
  return (project.dependenciesCount < 30) ? 1 : 0
}

// Number of source line codes
// NOTE: what is the number of sloc accepted ?
function reasonableNumOfSloc (project) {
  return (project.sloc.pkg < 5000 && project.sloc.real < 50000) ? 1 : 0
}

function hasTests (project) {
  return [
    project.tests.exists,
    project.tests.framework,
    project.tests.npmScript
  ].filter(Boolean).length > 1 ? 1 : 0
}

function isNotOutdated (project) {
  return project.outdated ? 0 : 1
}

function isNotDeprecated (project) {
  return project.deprecated ? 0 : 1
}
