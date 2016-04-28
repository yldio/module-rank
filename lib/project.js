var NpmApi = require('./api/npm')
var GithubApi = require('./api/github')
var async = require('async')
var moment = require('moment')
var semver = require('semver')

module.exports = Project

function Project (moduleName, version) {
  this.moduleName = moduleName
  this.version = version
}

function defineLatestVersion (versionsObj) {
  var latest = '0.0.0'

  for (var version in versionsObj) {
    if (semver.lt(latest, version)) latest = version
  }

  return latest || null
}

// TODO for now support only github repositories
// https://docs.npmjs.com/files/package.json#repository
function parseRepoUrl (repo) {
  // shorthand
  if (typeof repo === 'string') {
    var rgx = /gist:|bitbucket:|gitlab:/g
    if (repo.match(rgx)) {
      return null
    }

    return 'https://github.com/' + repo + '.git'
  } else {
    if (repo.type !== 'git') {
      return null
    }

    return repo.url
  }
}

Project.prototype.loadDetails = function (done) {
  var self = this

  async.series([
    function (next) {
      self.loadNpmDetails(next)
    },

    function (next) {
      self.loadGithubDetails(next)
    }
  ], done)
}

Project.prototype.loadNpmDetails = function (loadNext) {
  var self = this

  var npm = new NpmApi(this.moduleName)

  async.series([
    npm.view(function (next, viewObj) {
      if (self.version === 'latest') {
        self.version = defineLatestVersion(viewObj.versions)
      }

      // sane check
      if (!viewObj.versions[self.version]) {
        return next(new Error('Invalid package version'))
      }

      viewObj.time = viewObj.time || {}

      // Package general info
      self.versionsList = {}
      self.outdated = false
      for (var v in viewObj.time) {
        if (v === 'modified' || v === 'created') continue

        self.versionsList[v] = moment(viewObj.time[v])

        if (!self.outdated && semver.gt(v, self.version)) self.outdated = true
      }
      self.readme = viewObj.readmeFilename
      self.license = viewObj.license || false
      self.modified = viewObj.time.modified
      self.created = viewObj.time.created
      self.deprecated = (viewObj.deprecated) || false

      // Get package specific version info
      self.pkg = viewObj.versions[self.version]
      self.description = self.pkg.description
      self.keywords = self.pkg.keywords
      self.homepage = self.pkg.homepage
      self.repo_url = parseRepoUrl(self.pkg.repository)

      if (self.repo_url === null) {
        return next(new Error('Invalid repository url or repository version control not supported.'))
      }

      next()
    }),

    npm.lastMonthDownloads(function (next, downloadsCount) {
      self.installs = parseInt(downloadsCount, 10)

      next()
    }),

    npm.getDependents(function (next, deps) {
      self.dependents = deps

      next()
    })
  ], loadNext)
}

Project.prototype.loadGithubDetails = function (loadNext) {
  var self = this

  self.github = {}
  var githubApi = new GithubApi(self.repo_url)

  async.series([
    githubApi.getInfo(function (next, res) {
      self.github.stars = parseInt(res.body.stargazers_count, 10) || 0
      next()
    }),

    githubApi.getContributors(function (next, res) {
      self.github.contributors = []

      // sane check
      if (!Array.isArray(res.body)) {
        return next()
      }

      self.github.contributors = res.body.map(function (v) {
        return v.login
      })

      next()
    }),

    githubApi.getTags(function (next, res) {
      self.github.tags = []

      // sane check
      if (!Array.isArray(res.body)) {
        return next()
      }

      self.github.tags = res.body.map(function (v) {
        return semver.clean(v.name)
      })

      next()
    })
  ], loadNext)
}

// return { date: [moment obj], version: [semver]}
Project.prototype.getLatestRelease = function () {
  var latest = '0.0.0'

  for (var v in this.versionsList) {
    if (semver.lt(latest, v)) latest = v
  }

  return {
    version: latest,
    date: this.versionsList[latest]
  }
}

// return { date: [moment obj], version: [semver]}
Project.prototype.getFirstRelease = function () {
  var first = '999.999.999'

  for (var v in this.versionsList) {
    if (semver.gt(first, v)) first = v
  }

  return {
    version: first,
    date: this.versionsList[first]
  }
}
