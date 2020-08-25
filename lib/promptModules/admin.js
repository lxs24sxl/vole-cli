const fs = require('fs')
const { rcPath } = require('../options')
const { get } = require('../share-utils')

module.exports = cli => {
  const IsvolercExist = fs.existsSync(rcPath)
  const config = IsvolercExist ? JSON.parse(fs.readFileSync(rcPath, 'utf-8')) : null
  const configurable = config ? get(config.config, 'configurable') : true

  const checkIsAdmin = (answers) => answers.templateType === 'admin'

  cli.injectPrompt({
    name: 'adminTitle',
    type: 'input',
    when: answers => checkIsAdmin(answers) && configurable,
    message: '请输入后台模版名称',
    validate (input) {
      if (input === '') return '后台模版名称不能为空！'
      return true
    }
  })

  cli.injectPrompt({
    name: 'publicPath',
    type: 'input',
    when: answers => checkIsAdmin(answers) && configurable,
    message: '请输入后台模版路由名( 路由为空则为一级路由,否则为二级路由,例:/retail/ )',
    description: '路由为空则为一级路由,否则为二级路由'
  })

  cli.injectPrompt({
    name: 'adminName',
    type: 'input',
    when: answers => checkIsAdmin(answers) && configurable,
    message: '请输入后台模版系统编码( 传递给后端的名称,例:admin-retail )',
    description: '传递给后端的名称',
    validate (input) {
      if (input === '') return '后台模版系统编码不能为空！'
      return true
    }
  })

  cli.injectPrompt({
    name: 'port',
    type: 'input',
    when: answers => checkIsAdmin(answers) && configurable,
    message: '请输入端口号',
    validate (input) {
      if (input === '') {
        return '端口号不能为空！'
      } else if (!(/^[0-9]*$/.test(input))) {
        return '端口号不能为非数字！'
      }

      return true
    }
  })

  cli.onPromptComplete((answers, options) => {
    const { adminTitle, publicPath, port, adminName } = answers
    if (adminTitle) options.adminTitle = adminTitle
    if (publicPath) options.publicPath = publicPath
    if (adminName) options.adminName = adminName
    if (port) options.port = port
  })
}
