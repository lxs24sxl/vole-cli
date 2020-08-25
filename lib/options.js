const fs = require('fs-extra')
const cloneDeep = require('lodash.clonedeep')

const { getRcPath } = require('./utils/rcPath')
const { error } = require('../lib/share-utils')
const rcPath = exports.rcPath = getRcPath('.volerc')

exports.defaults = {
  // VUE_ADMIN_TEMPLATE_REPO: '',
  config: {
    configurable: true // 是否配置名称之类
  }
}

let cachedOptions

exports.loadOptions = () => {
  if (cachedOptions) {
    return cachedOptions
  }
  if (fs.existsSync(rcPath)) {
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
    } catch (e) {
      error(
        `Error loading saved preferences: ` +
        `~/.volerc may be corrupted or have syntax errors. ` +
        `Please fix/delete it and re-run vole-cli in manual mode.\n` +
        `(${e.message})`
      )
      process.exit(1)
    }

    return cachedOptions
  } else {
    return exports.defaults
  }
}

exports.saveOptions = toSave => {
  const options = Object.assign(cloneDeep(exports.loadOptions()), toSave)

  for (const key in options) {
    if (!(key in exports.defaults)) {
      delete options[key]
    }
  }

  cachedOptions = options

  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2))
    return true
  } catch (e) {
    error(
      `Error saving preferences: ` +
      `make sure you have write access to ${rcPath}.\n` +
      `(${e.message})`
    )
  }
}

exports.savePreset = (name, preset) => {
  const presets = cloneDeep(exports.loadOptions().presets || {})
  presets[name] = preset
  return exports.saveOptions({ presets })
}
