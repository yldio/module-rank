var request = require('request')
var url = require('url')

function ghRequest (uri, cb, next) {
  request({
    method: 'GET',
    uri: url.resolve('https://api.github.com', uri),
    headers: {
      'Accept': 'application/vnd.github.v3+jso',
      'User-Agent': 'yldio'
    }
  }, function (err, res) {
    if (err || res.statusCode !== 200) {
      return next(err || new Error((res.body && res.body.message) ? res.body.message : 'Unknown error'))
    }

    cb(next, res)
  })
}

function GithubApi (repoUrl) {
  // TODO validate repoUrl

  // Remove protocol from url
  repoUrl = repoUrl.split('//')[1]

  // Arr pos
  // 1 - domain
  // 2 - owner
  // 3 - repo
  repoUrl = repoUrl.split('/')

  this.owner = repoUrl[1]
  this.repo = repoUrl[2].replace('.git', '')
}

GithubApi.prototype.getInfo = function (cb) {
  return function (next) {
    ghRequest('/repos/' + this.owner + '/' + this.repo, cb, next)
  }
}

GithubApi.prototype.getReleases = function (cb) {
  return function (next) {
    ghRequest('/repos/' + this.owner + '/' + this.repo + '/releases', cb, next)
  }
}

GithubApi.prototype.getContributors = function (cb) {
  return function (next) {
    ghRequest('/repos/' + this.owner + '/' + this.repo + '/contributors', cb, next)
  }
}

module.exports = GithubApi
