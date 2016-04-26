var cleanObj = require('clean-obj')

module.exports = {}
module.exports.rank = rank
module.exports.score = score

function rank (prj) {
  // Source rank algorithm from libraries.io with some tweaks
  // models/concern/source_rank.rb
  return {
    'basic-info': basicInfoExists(prj) ? 1 : 0,
    'repo-exists': repoExists(prj) ? 1 : 0,
    'readme-exists': readmeExists(prj) ? 1 : 0,
    'acpt-licence-exists': acceptableLicenseExists(prj) ? 1 : 0,
    'has-many-versions': hasManyVersions(prj) ? 1 : 0,
    'follows-semver': followsSemver(prj) ? 1 : 0,
    'recent-release': recentRelease(prj) ? 1 : 0,
    'not-brand-new': notBrandNew(prj) ? 1 : 0,
    'v1-or-greater': atLeastV1(prj) ? 1 : 0,
    'dependent-modules': scale(dependentModules(prj)) * 2,
    'npm-installs-every-month': scale(npmInstalls(prj)),
    'github-stars': scale(ghStars(prj)),
    'contributors': Math.ceil(scale(ghContributors(prj) / 2)),
    'all-prereleases': allPreReleases(prj) ? -2 : 0,
    'any-outdated-deps': anyOutdatedDeps(prj) ? -1 : 0,
    'isDeprecated': isDeprecated(prj) ? -5 : 0,
    'isUnmaintained': isUnmaintained(prj) ? -5 : 0,
    'isRemoved': isRemoved(prj) ? -5 : 0
  }
}

function score (prj) {
  var rankObj = rank(prj)
  var rankArr = []

  for (var k in rankObj) {
    rankArr.push(rankObj[k])
  }

  return rankArr.reduce(function (a, b) { return a + b })
}

function scale (number) {
  if (number <= 0) return 0

  return Math.round(Math.log10(number))
}

function basicInfoExists (project) {
  var info = [
    project.description,
    project.homepage,
    project.repository_url,
    project.keywords_array
  ]

  return Object.keys(cleanObj(info, true)).length > 1
}

function repoExists (project) {}

function readmeExists (project) {}

function acceptableLicenseExists (project) {}

function hasManyVersions (project) {}

function followsSemver (project) {}

function recentRelease (project) {}

function notBrandNew (project) {}

function atLeastV1 (project) {}

function dependentModules (project) {}

function npmInstalls (project) {}

function ghStars (project) {}

function ghContributors (project) {}

function allPreReleases (project) {}

function anyOutdatedDeps (project) {}

function isDeprecated (project) {}

function isUnmaintained (project) {}

function isRemoved (project) {}
