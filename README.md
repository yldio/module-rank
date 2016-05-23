# Module rank
This is our formula to rank modules based on statistical data from [`module-data`](https://github.com/yldio/module-data).

## Installation

```bash
npm i module-rank
```

## Usage

```js
var moduleRank = require('module-rank')

var standardData = { ... }

var options = {
  licensesWhiteList: ['MIT']
}

moduleRank(standardData, [options,] callback)
```

## Formula breakdown
We have three areas of concern and those are:

- Security
- Reliability
- License

### Security
The criteria of `Security` for public modules is:

- `noVuln` - This is an array of objects that comes from [`snyk`](https://snyk.io/).

For private modules, there is no criteria to evaluate.

### Reliability
The criteria of `Reliability` for public modules is:

- `hasTests`
- `isNotOutdated`
- `isNotDeprecated` - If this is `false`, the score of this area of concern is 0.

For private modules is:

- `hasTests`

### License
The criteria of `License` for public and private modules is:

- `hasLicense`
- `licenseOnWhiteList`
