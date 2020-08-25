const EventEmitter = require('events')
const inquirer = require('inquirer')
const PromptModuleAPI = require('./PromptModuleAPI')

const { clearConsole, chalk } = require('./share-utils')
const { saveOptions } = require('./options')

const Generator = require('./Generator')
// const writeFileTree = require('./utils/writeFileTree')

const isManualMode = answers => answers.preset === '__manual__'

module.exports = class Creator extends EventEmitter {
  constructor (name, context, promptModules) {
    super()
    this.name = name
    this.context = context
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts()
    this.presetPrompt = presetPrompt
    this.featurePrompt = featurePrompt
    this.injectedPrompts = []
    this.promptCompleteCbs = []

    const promptAPI = new PromptModuleAPI(this)
    promptModules.forEach(m => {
      return m(promptAPI)
    })
  }

  async create (cliOptions = {}, preset = null) {
    const {
      name,
      context
    } = this
    if (!preset) {
      preset = await this.promptAndResolvePreset()
    }
    // console.log('preset', preset)
    const pkg = {
      name,
      version: '0.1.0',
      private: true,
      devDependencies: {}
    }
    // console.log('pkg', pkg)
    // await writeFileTree(context, {
    //   'package.json': JSON.stringify(pkg, null, 2)
    // })

    const generator = new Generator(preset, context)
    generator.download()
  }

  async promptAndResolvePreset (answers = null) {
    saveOptions({})

    // prompt
    if (!answers) {
      await clearConsole()

      answers = await inquirer.prompt(this.resolveFinalPrompts())
    }

    let preset

    // todo: React模版
    // if (answers.frameType === 'react') {
    //   console.error(chalk.red.dim('Warning: 敬请期待~'))
    //   process.exit(1)
    // }

    // todo: 如果是预设模版，则进入这里
    if (answers.preset && answers.preset !== '__manual__') {
      // preset = await this.resolvePreset(answers.preset)
    } else {
      // manual
      preset = {
        useConfigFiles: answers.useConfigFiles === 'files',
        plugins: {}
      }
      answers.features = answers.features || []
      // run cb registered by prompt modules to finalize the preset
      // console.log('this.promptCompleteCbs', this.promptCompleteCbs)
      this.promptCompleteCbs.forEach(cb => cb(answers, preset))
    }

    // console.log('promptAndResolvePreset', preset)
    // preset = cloneDeep(preset)

    return preset
  }

  resolveFinalPrompts () {
    // patch generator-injected prompts to only show in manual mode
    this.injectedPrompts.forEach(prompt => {
      const originalWhen = prompt.when || (() => true)

      prompt.when = answers => {
        // return isManualMode(answers) && originalWhen(answers)
        return originalWhen(answers)
      }
    })

    const prompts = [
      // this.presetPrompt,
      // this.featurePrompt,
      ...this.injectedPrompts
    ]

    return prompts
  }

  resolveIntroPrompts () {
    const presetPrompt = {
      name: 'preset',
      type: 'list',
      message: `Please pick a preset:`,
      choices: [
        // ...presetChoices,
        {
          name: 'Manually select features',
          value: '__manual__'
        }
      ]
    }

    const featurePrompt = {
      name: 'features',
      when: isManualMode,
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      pageSize: 10
    }

    return {
      presetPrompt,
      featurePrompt
    }
  }
}
