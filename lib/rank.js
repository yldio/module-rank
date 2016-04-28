var cleanObj = require('clean-obj')
var licenses = require('./licenses')
var moment = require('moment')
var semver = require('semver')

var sixMonthsAgo = moment().subtract(6, 'months')

module.exports = {}
module.exports.rank = criteria
module.exports.score = score

function criteria (prj) {
  // Source rank algorithm from libraries.io with some tweaks
  return {
    'basic-info': basicInfoExists(prj) ? 1 : 0,
    'repo-exists': repoExists(prj) ? 1 : 0,
    'readme-exists': readmeExists(prj) ? 1 : 0,
    'acpt-licence-exists': 1 / acceptableLicenseExists(prj),
    'has-many-versions': hasManyVersions(prj) ? 1 : 0,
    'recent-release': recentRelease(prj) ? 1 : 0,
    'not-brand-new': notBrandNew(prj) ? 1 : 0,
    'v1-or-greater': atLeastV1(prj) ? 1 : 0,
    'is-tagged': isTagged(prj) ? 1 : -2,
    'dependent-modules': scale(dependentModules(prj)) * 2,
    'npm-installs-every-month': scale(npmInstalls(prj)),
    'github-stars': scale(ghStars(prj)),
    'contributors': Math.ceil(scale(ghContributors(prj) / 2)),
    'all-prereleases': allPreReleases(prj) ? -2 : 0,
    'any-outdated-deps': anyOutdatedDeps(prj) ? -1 : 0,
    'is-deprecated': isDeprecated(prj) ? -5 : 0,
    'is-unmaintained': isUnmaintained(prj) ? -5 : 0,
    'is-removed': isRemoved(prj) ? -5 : 0
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

function readmeExists (project) {
  return (project.readme)
}

function acceptableLicenseExists (project) {
  var licenseRank = licenses(project.license)

  // tweak the formula
  if (licenseRank < 0) {
    licenseRank *= -1
    licenseRank = 1 / licenseRank
  }

  return licenseRank
}

function hasManyVersions (project) {
  return Object.keys(project.versions).length > 1
}

function recentRelease (project) {
  return project.getLatestRelease().date.isBefore(sixMonthsAgo)
}

function notBrandNew (project) {
  return project.getFirstRelease().date.isAfter(sixMonthsAgo)
}

function atLeastV1 (project) {
  return semver.gte(project.getLatestRelease().version, '1.0.0')
}

// Was every npm version released tagged on giuthub as well?
function isTagged (project) {

}

function dependentModules (project) {}

// last month
function npmInstalls (project) {
  return project.installs
}

function ghStars (project) {}

function ghContributors (project) {}

function allPreReleases (project) {}

function anyOutdatedDeps (project) {}

function isDeprecated (project) {}

function isUnmaintained (project) {}

function isRemoved (project) {}
