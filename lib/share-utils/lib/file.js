const fs = require('fs-extra')
const path = require('path')

function deleteRemoveFiles (directory, newFiles, previousFiles) {
  const filesToDelete = Object.keys(previousFiles).filter(filename => !newFiles[filename])

  return Promise.all(filesToDelete.map(filename => {
    return fs.unlink(path.join(directory, filename))
  }))
}

exports.writeFileTree = async function (dir, files, previousFiles) {
  if (previousFiles) {
    await deleteRemoveFiles(dir, files, previousFiles)
  }
  Object.keys(files).forEach(name => {
    const filePath = path.join(dir, name)
    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath, files[name])
  })
}
