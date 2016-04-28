var exec = require('child_process').exec

function NpmApi (moduleName) {
  this.moduleName = moduleName
}

NpmApi.prototype.view = function (done) {
  return function () {
    exec('npm view ' + this.moduleName, function (err, stdout, stderr) {
      if (err || stderr) {
        return done(err || stderr)
      }

      // TODO: Nasty hack, need to improve this
      try {
        stdout = stdout.trim()
        var obj
        eval('obj = ' + stdout) // eslint-disable-line no-eval

        return done(null, obj)
      } catch (e) {
        return done(e)
      }
    })
  }
}

module.exports = NpmApi
