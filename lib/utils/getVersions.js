module.exports = function getVersions () {
  const { version, name } = require('../../package.json')

  return {
    version,
    name
  }
}
