module.exports = rank

function rank (mdl) {
  var criteria = {
    noVuln: noVuln(mdl)
  }

  return {
    criteria: criteria,
    score: criteria.noVuln ? 1 : 0
  }
}

function noVuln (project) {
  return !project.vulnerabilities.length > 0 ? 1 : 0
}
