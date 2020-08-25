const chalk = require('chalk')
const readline = require('readline')
const stripAnsi = require('strip-ansi')
const EventEmitter = require('events')

const { stopSpinner } = require('./spinner')

exports.events = new EventEmitter()

function _log (type, tag, message) {
  if (message) {
    exports.events.emit('log', {
      message,
      type,
      tag
    })
  }
}

const format = (label, msg) => {
  return msg.split('\n').map((line, i) => {
    return i === 0
      ? `${label} ${line}`
      : line.padStart(stripAnsi(label).length)
  }).join('\n')
}

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)

exports.clearConsole = title => {
  const stdout = process.stdout
  if (stdout.isTTY) {
    const blank = '\n'.repeat(stdout.rows)
    console.log(blank)
    readline.cursorTo(stdout, 0, 0)
    readline.clearScreenDown(stdout)
    if (title) {
      console.log(title)
    }
  }
}

exports.error = (msg, tag = null) => {
  stopSpinner()
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)))
  _log('error', tag, msg)
  if (msg instanceof Error) {
    console.error(msg.stack)
    _log('error', tag, msg.stack)
  }
}

exports.log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg)
  _log('log', tag, msg)
}
