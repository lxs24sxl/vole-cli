
const homedir = require('os').homedir()
const { chalk, semver } = require('./share-utils')

const requiredVersion = require('../package.json').engines.node
const getVersions = require('./utils/getVersions')

const { name, version } = getVersions()

/**
 * 校验node版本
 * @param {*} wanted 想要的版本号
 * @param {*} id 项目
 */
function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, name)

if (semver.satisfies(process.version, '9.x')) {
  console.log(chalk.red(
    `You are using Node ${process.version}.\n
    Node.js 9.x has already reached end-of-life and will not be supported in future major releases.\n
    It's strongly recommended to use an active LTS version instead.`
  ))
}

const program = require('commander')
const leven = require('leven')
const minimist = require('minimist')

program
  .version(`${name} ${version}`)
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new project powered by vole-cli-service')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    const argv = process.argv

    if (minimist(argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }

    //  // --git makes commander to default git to true
    //  if (argv.includes('-g') || argv.includes('--git')) {
    //   options.forceGit = true
    // }

    require('../lib/create')(name, options)
  })
program
  .command('init')
  .description('initialize the .volerc file')
  .action(cmd => {
    require('../lib/init')()
  })
program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get <key>', 'get value from option')
  .option('-s, --set <key> <value>', 'set option value')
  .option('-d, --delete <key>', 'delete option from config')
  .option('-e, --edit', 'open config with default editor')
  .option('--json', 'outputs JSON result only')
  .action((value, cmd) => {
    const options = cleanArgs(cmd)
    require('../lib/config')(value, options)
  })

program
  .arguments('<command>')
  .action(cmd => {
    program.outputHelp()
    console.log('  ' + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`))
    console.log()
    suggestCommands(cmd)
  })

// add some useful info on help
program.on('--help', () => {
  console.log(`  Run ${chalk.cyan('vole <command> --help')} for detailed usage of given command.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

function suggestCommands (unknownCommand) {
  const avaliableCommands = program.commands.map(cmd => cmd._name)

  let suggestion = null
  let levenSum = null
  avaliableCommands.forEach(cmd => {
    levenSum = leven(cmd, unknownCommand)
    const isBestMatch = levenSum < leven(suggestion || '', unknownCommand)
    if (levenSum < 3 && isBestMatch) {
      suggestion = cmd
    }
  })

  if (suggestion) console.log('  ' + chalk.red(`Did you mean ${chalk.yellow(suggestion)}.`))
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
