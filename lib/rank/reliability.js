var omit = require('lodash.omit')
var score = require('../score-weight')

var weights = {
  numOfDeps: 2,
  numOfSloc: 2,
  hasTests: 3,
  coverage: 1,
  isNotOutdated: 3
}

module.exports = rank

function rank (prj) {
  var reliabilityRank = {}
  reliabilityRank.criteria = criteria(prj)
  reliabilityRank.score = score(
    weights,
    omit(reliabilityRank.criteria, 'isNotDeprecated')
  )

  reliabilityRank.score *= reliabilityRank.criteria.isNotDeprecated

  return reliabilityRank
}

function criteria (prj) {
  return {
    numOfDeps: numOfDeps(prj),
    numOfSloc: numOfSloc(prj),
    hasTests: hasTests(prj),
    coverage: coverage(prj),
    isNotOutdated: isNotOutdated(prj),
    isNotDeprecated: isNotDeprecated(prj)
  }
}

// Number of dependencies
// TODO what is the number of deps accepted
function numOfDeps (project) {}

// Number of source line codes
// TODO what is the number of sloc accepted
function numOfSloc (project) {}

function hasTests (project) {
  return project.tests.exists ? 1 : 0
}

function coverage (project) {
  return project.tests.coverage
}

function isNotOutdated (project) {
  return project.outdated ? 0 : 1
}

function isNotDeprecated (project) {
  return project.deprecated ? 0 : 1
}
