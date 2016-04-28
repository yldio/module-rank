var request = require('request')
var url = require('url')

function ghRequest (uri, done) {
  return request({
    method: 'GET',
    uri: url.resolve('https://api.github.com', uri),
    headers: {
      'Accept': 'application/vnd.github.v3+jso',
      'User-Agent': 'yldio'
    }
  }, function (err, res) {
    if (err || res.statusCode !== 200) {
      return done(err || new Error((res.body && res.body.message) ? res.body.message : 'Unknown error'))
    }

    return done(null, res)
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

GithubApi.prototype.getReleases = function (done) {
  return function () {
    return ghRequest('/repos/' + this.owner + '/' + this.repo + '/releases', done)
  }
}

module.exports = GithubApi
