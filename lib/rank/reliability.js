var omit = require('lodash.omit')
var score = require('../score-weight')

var weights = {
  hasTests: 1,
  isNotOutdated: 1
}

module.exports = rank

function rank (mdl) {
  var reliabilityRank = {}

  reliabilityRank.criteria = criteria(mdl)
  if (mdl.private) {
    reliabilityRank.criteria = omit(
      reliabilityRank.criteria,
      ['isNotOutdated', 'isNotDeprecated']
    )

    reliabilityRank.score = score(
      omit(weights, 'isNotOutdated'),
      reliabilityRank.criteria
    )
  } else {
    reliabilityRank.score = score(
      weights,
      omit(reliabilityRank.criteria, 'isNotDeprecated')
    )

    reliabilityRank.score *= reliabilityRank.criteria.isNotDeprecated
    reliabilityRank.score = parseFloat(reliabilityRank.score.toFixed(2))
  }

  return reliabilityRank
}

function criteria (mdl) {
  return {
    hasTests: hasTests(mdl),
    isNotOutdated: isNotOutdated(mdl),
    isNotDeprecated: isNotDeprecated(mdl)
  }
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
