module.exports = rank

function rank (mdl, whiteList) {
  var criteria = {
    hasLicense: hasLicense(mdl),
    licenseOnWhiteList: licenseOnWhiteList(mdl, whiteList)
  }

  return {
    criteria: criteria,
    score: criteria.hasLicense && criteria.licenseOnWhiteList ? 1 : 0
  }
}

function hasLicense (module) {
  return module.license ? 1 : 0
}

function licenseOnWhiteList (module, whiteList) {
  return ~whiteList.indexOf(module.license) ? 1 : 0
}
