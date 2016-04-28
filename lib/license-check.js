module.exports = licenseCheck

var licenses = {
  'Apache': /Apache License\b/,
  'MPL': /Mozilla Public License Version 2\.0\b/,
  'MIT': /ermission is hereby granted, free of charge, to any/,
  'BSD': /edistribution and use in source and binary forms, with or withou/,
  'ISC': /The ISC License/,
  'GPLv3': /The GNU General Public License is a free, copyleft license for/,
  'LGPLv3': /incorporates the terms and conditions of version 3 of the GNU General Public License/,
  'AGPLv3': /The GNU Affero General Public License is a free, copyleft license for/,
  'Unlicense': /is free to copy, modify, publish, use, compile, sell, or distribute this software/
}

var licensesRank = {
  1: ['MIT', 'BSD', 'ISC', 'Unlicense'],
  2: ['Apache', 'MPL'],
  3: ['GPLv3', 'LGPLv3', 'AGPLv3'],
  // TODO the rest of licenses
  4: ['']
}

function licenseCheck (project, cb) {
  return function (next) {
    var license

    cb(next, license)
  }
}
