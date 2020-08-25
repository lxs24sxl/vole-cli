module.exports = cli => {
  cli.injectPrompt({
    name: 'templateType',
    when: answers => ['vue', 'react'].includes(answers.frameType),
    type: 'list',
    message: `请选择一种模版类型`,
    description: `test.`,
    choices: [
      {
        name: 'Admin',
        value: 'admin'
      },
      {
        name: 'Standard',
        value: 'standard'
      },
      {
        name: 'H5',
        value: 'h5'
      },
      {
        name: 'App',
        value: 'app'
      },
      {
        name: 'quickapp',
        value: 'quickapp'
      }
    ]
  })

  cli.injectPrompt({
    name: 'templateType',
    when: answers => ['node'].includes(answers.frameType),
    type: 'list',
    message: `请选择一种模版类型`,
    description: `test.`,
    choices: [
      {
        name: 'Egg',
        value: 'egg'
      },
      {
        name: 'Koa',
        value: 'koa'
      },
      {
        name: 'Nest',
        value: 'nest'
      },
      {
        name: 'Cabloy',
        value: 'cabloy'
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.templateType) {
      options.templateType = answers.templateType
    }
  })
}
