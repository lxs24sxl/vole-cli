exports.getPromptModules = () => {
  return [
    'frameType',
    'templateType'
    // 'admin'
    // 'cssPreprocessors'
  ].map(file => require(`../promptModules/${file}`))
}
