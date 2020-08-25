module.exports = cli => {
  cli.injectPrompt({
    name: 'frameType',
    // when: () => true,
    type: 'list',
    message: `请选择一种前端框架`,
    description: `test.`,
    choices: [
      {
        name: 'Vue',
        value: 'vue'
      },
      {
        name: 'React',
        value: 'react'
      },
      {
        name: 'Node',
        value: 'node'
      }
    ]
  })

  cli.onPromptComplete((answers, options) => {
    if (answers.frameType) {
      options.frameType = answers.frameType
    }
  })
}
