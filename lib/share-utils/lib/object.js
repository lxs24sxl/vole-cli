exports.get = function (target, path) {
  const fields = path.split('.')
  let obj = target
  const len = fields.length

  for (let i = 0; i < len - 1; i++) {
    const key = fields[i]
    if (!obj[key]) return undefined

    obj = obj[key]
  }

  return obj[fields[len - 1]]
}

exports.set = function (target, path, value) {
  const fields = path.split('.')
  let obj = target
  const len = fields.length

  for (let i = 0; i < len - 1; i++) {
    const key = fields[i]
    if (!obj[key]) obj[key] = {}

    obj = obj[key]
  }

  obj[fields[len - 1]] = value
}

exports.unset = function (target, path) {
  const fields = path.split('.')
  let obj = target
  const len = fields.length
  const objs = []

  for (let i = 0; i < len - 1; i++) {
    const key = fields[i]
    if (!obj[key]) return

    objs.unshift({ parent: obj, key, value: obj[key] })
    obj = obj[key]
  }

  delete obj[fields[len - 1]]

  // Clear empty objects
  for (const { parent, key, value } of objs) {
    if (!Object.keys(value).length) {
      delete parent[key]
    }
  }
}
