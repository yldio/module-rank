var score = require('../score-weight')

var weights = {
  npmInstallsMonth: 1,
  githubStars: 1
}

var threshold = {
  npmInstallsMonth: 1000000,
  githubStars: 1000
}

module.exports = rank

function rank (prj) {
  var popRank = {}
  popRank.criteria = criteria(prj)
  popRank.score = score(weights, popRank.criteria)

  return popRank
}

function criteria (prj) {
  return {
    npmInstallsMonth: npmInstallsMonth(prj),
    githubStars: githubStars(prj)
  }
}

function npmInstallsMonth (project) {
  var scorePercentage = project.installs / threshold.npmInstallsMonth

  if (scorePercentage > 1) {
    scorePercentage = 1
  }

  return scorePercentage.toFixed(2)
}

function githubStars (project) {
  var scorePercentage = project.github.stars / threshold.githubStars

  if (scorePercentage > 1) {
    scorePercentage = 1
  }

  return scorePercentage.toFixed(2)
}
