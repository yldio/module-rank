var npm = require('./api/npm')
var github = require('./api/github')
var async = require('async')
var moment = require('moment')

module.exports = Project

// Project
function Project (moduleName) {
  this.moduleName = moduleName
}

Project.prototype.loadDetails = function (done) {
  var self = this

  npm.view(this.moduleName, function (err, viewObj) {
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
  })
}

Project.prototype.export = function () {
  return {
    description: this.description,
    homepage: this.homepage,
    repo_url: this.repo_url,
    keywords: this.keywords
  }
}

// return { npm: [moment obj], github: [moment obj]}
Project.prototype.getLatestRelease = function () {}
Project.prototype.getFirstRelease = function () {}
