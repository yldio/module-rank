var cleanObj = require('clean-obj')
var moment = require('moment')
var semver = require('semver')

var sixMonthsAgo = moment().subtract(6, 'months')

module.exports = {}
module.exports.criteria = criteria
module.exports.score = score

function criteria (prj) {
  // Source rank algorithm from libraries.io with some tweaks
  return {
    'basic-info': basicInfoExists(prj) ? 1 : -1,
    'repo-exists': repoExists(prj) ? 1 : -1,
    'license-exists': licenseExists(prj) ? 1 : -5,
    'readme-exists': readmeExists(prj) ? 1 : 0,
    'has-many-versions': hasManyVersions(prj) ? 1 : 0,
    'recent-release': recentRelease(prj) ? 1 : 0,
    'not-brand-new': notBrandNew(prj) ? 1 : 0,
    'v1-or-greater': atLeastV1(prj) ? 1 : 0,
    'is-tagged': isTagged(prj) ? 1 : 0,
    'dependent-modules': Math.ceil(scale(dependentModules(prj)) * 2),
    'npm-installs-every-month': scale(npmInstalls(prj)),
    'github-stars': scale(ghStars(prj)) * 2,
    'contributors': Math.ceil(scale(ghContributors(prj)) * 5),
    'is-outdated': isOutdated(prj) ? -3 : 0,
    'is-deprecated': isDeprecated(prj) ? -5 : 0
  }
}

function score (criteriaObj) {
  var rank = []

  for (var k in criteriaObj) {
    rank.push(criteriaObj[k])
  }

  return rank.reduce(function (a, b) { return a + b })
}

function scale (number) {
  if (number <= 0) return 0

  return Math.round(Math.log10(number))
}

function basicInfoExists (project) {
  var info = [
    project.description,
    project.homepage,
    project.keywords
  ]

  return Object.keys(cleanObj(info, true)).length > 1
}

function repoExists (project) {
  return (project.repo_url)
}

function licenseExists (project) {
  return project.license !== 'UNLICENSED'
}

function readmeExists (project) {
  return (project.readme)
}

function hasManyVersions (project) {
  return Object.keys(project.versionsList).length > 1
}

function recentRelease (project) {
  return project.getLatestRelease().date.isAfter(sixMonthsAgo)
}

function notBrandNew (project) {
  return project.getFirstRelease().date.isBefore(sixMonthsAgo)
}

function atLeastV1 (project) {
  return semver.gte(project.getLatestRelease().version, '1.0.0')
}

function isTagged (project) {
  return project.github.tags.length > 0
}

function dependentModules (project) {
  return project.dependents.length
}

// last month
function npmInstalls (project) {
  return project.installs
}

function ghStars (project) {
  return project.github.stars
}

function ghContributors (project) {
  return project.github.contributors.length
}

function isOutdated (project) {
  return project.outdated
}

function isDeprecated (project) {
  return project.deprecated
}
