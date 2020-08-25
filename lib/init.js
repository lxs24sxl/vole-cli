const { stopSpinner, clearConsole, logWithSpinner, error, succeedSpinner } = require('../lib/share-utils')
const { saveOptions } = require('./options')

async function init () {
  await clearConsole()

  logWithSpinner('.async file is being generated')

  await saveOptions()

  succeedSpinner('.async file has been generated')
}

module.exports = (...args) => {
  return init(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
  })
}
