module.exports = rank

function rank (prj) {
  var criteria = {
    hasLicense: hasLicense(prj),
    licenseOnWhiteList: licenseOnWhiteList(prj)
  }

  return {
    criteria: criteria,
    score: criteria.hasLicense && criteria.licenseOnWhiteList ? 1 : 0
  }
}

function hasLicense (project) {
  return project.license ? 1 : 0
}

function licenseOnWhiteList (project) {
  return project.licenseIsOkay ? 1 : 0
}
