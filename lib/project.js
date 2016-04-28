var NpmApi = require('./api/npm')
var GithubApi = require('./api/github')
var async = require('async')
var moment = require('moment')

module.exports = Project

// Project
function Project (moduleName) {
  this.moduleName = moduleName
}

Project.prototype.loadDetails = function (done) {
  var self = this

  var npm = new NpmApi(this.moduleName)
  var github

  async.series([
    npm.view(function (err, viewObj) {
      if (err) {
        return done(err)
      }

      self.description = viewObj.description
      self.keywords = viewObj.keywords

      // TODO: Need to verify legitimacy of this
      self.homepage = viewObj.homepage
      self.repo_url = viewObj.repository ? viewObj.repository.url : ''

      self.readme = viewObj.readmeFilename

      viewObj.time = viewObj.time || {}
      self.modified = viewObj.time.modified
      self.created = viewObj.time.created

      self.versions = {}
      for (var timeKey in viewObj.time) {
        if (timeKey === 'modified' || timeKey === 'created') {
          continue
        }
        self.versions[timeKey] = viewObj.time[timeKey]
      }

      self.github = {}
      github = new GithubApi(self.repo_url)
    }),

    npm.lastMonthDownloads(function (err, downloadsCount) {
      if (err) {
        return done(err)
      }

      self.installs = downloadsCount
    }),

    github.getReleases(function (err, res) {
      if (err) {
        return done(err)
      }

      self.github.tags = res.body
    })

  ], done)
}

Project.prototype.export = function () {
  return {
    description: this.description,
    homepage: this.homepage,
    repo_url: this.repo_url,
    keywords: this.keywords,
    readme: this.readme,
    modified: this.modified,
    created: this.created,
    versions: this.versions,
    installs: this.installs,
    github: this.github
  }
}

// return { date: [moment obj], version: [semver]}
Project.prototype.getLatestRelease = function () {}
Project.prototype.getFirstRelease = function () {}
