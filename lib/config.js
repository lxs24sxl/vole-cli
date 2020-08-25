const fs = require('fs-extra')

const path = require('path')

const { error, get, set, launch, unset, clearConsole } = require('./share-utils')
const { getRcPath } = require('./utils/rcPath')

async function configure (value, options) {
  const file = path.resolve(getRcPath('.volerc'))
  const config = await fs.readJson(file)

  const { json, get: optGet, edit, set: optSet, delete: optDelete } = options || {}

  // log .volerc
  if (!optGet && !edit && !optDelete && !optSet) {
    if (json) {
      console.log(JSON.stringify({
        resolvedPath: file,
        content: config
      }, null, 2))
    } else {
      console.log('Resolved path: ' + file + '\n', JSON.stringify(config, null, 2))
    }
  }

  // 获取
  if (optGet) {
    const value = get(config.config, optGet) || get(config, optGet)
    if (json) {
      console.log(JSON.stringify({
        value
      }, null, 2))
    } else {
      console.log(value)
    }
  }

  // 删除
  if (optDelete) {
    unset(config.config, optDelete)
    await fs.writeFile(file, JSON.stringify(config, null, 2), 'utf-8')
    if (json) {
      console.log(JSON.stringify({
        deleted: optDelete
      }))
    } else {
      console.log(`You have removed the option: ${optDelete}`)
    }
  }

  // 编辑
  if (edit) {
    launch(file)
  }

  if (optSet && !value) {
    throw new Error(`Make sure you define a value for the option ${optSet}`)
  }

  // 设置
  if (optSet && value) {
    if (value.match('[0-9]')) {
      set(config.config, options.set, value)
    } else if (value === 'true') {
      set(config.config, options.set, true)
    } else if (value === 'false') {
      set(config.config, options.set, false)
    } else {
      set(config.config, options.set, value)
    }

    await fs.writeFile(file, JSON.stringify(config, null, 2), 'utf-8')

    if (json) {
      console.log(JSON.stringify({
        updated: optSet
      }))
    } else {
      console.log(`You have updated the option: ${optSet} to ${value}`)
    }
  }
}

module.exports = (...args) => {
  return configure(...args).catch(err => {
    error(err)
  })
}
